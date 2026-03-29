package controller;

import entity.Attendance;
import entity.Marks;
import entity.Student;

import repository.AttendanceRepository;
import repository.MarksRepository;
import repository.StudentRepository;

import service.HallTicketService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private HallTicketService hallTicketService;

    // =============================
    // ADD STUDENT
    // =============================
    @PostMapping("/add")
    public Student addStudent(@RequestBody Student student) {

        if (student.getSemester() == null) student.setSemester(1);
        if (student.getFeePaid() == null) student.setFeePaid(0);
        if (student.getRole() == null) student.setRole("STUDENT");

        return studentRepository.save(student);
    }

    // =============================
    // GET ALL STUDENTS
    // =============================
    @GetMapping("/all")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // =============================
    // LOGIN
    // =============================
    @PostMapping("/login")
    public Object login(@RequestBody Student student) {

        List<Student> students = studentRepository.findAll();

        for (Student s : students) {
            if (s.getRollNo() != null && s.getPassword() != null &&
                s.getRollNo().equals(student.getRollNo()) &&
                s.getPassword().equals(student.getPassword())) {

                return s;
            }
        }

        return "Invalid Credentials";
    }

    // =============================
    // ATTENDANCE
    // =============================
    @GetMapping("/attendance/{studentId}")
    public List<Attendance> getAttendance(@PathVariable Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    // =============================
    // MARKS
    // =============================
    @GetMapping("/marks/{studentId}")
    public List<Marks> getMarks(@PathVariable Long studentId) {
        return marksRepository.findByStudentId(studentId);
    }

    // =============================
    // ELIGIBILITY
    // =============================
    @GetMapping("/eligibility/{studentId}")
    public String checkEligibility(@PathVariable Long studentId) {

        Student student = studentRepository.findById(studentId).orElse(null);

        if (student == null) return "Student not found";
        if (student.getFeePaid() == 0) return "Not Eligible (Fee not paid)";

        List<Attendance> attendanceList = attendanceRepository.findByStudentId(studentId);
        List<Marks> marksList = marksRepository.findByStudentId(studentId);

        if (attendanceList.isEmpty() || marksList.isEmpty()) return "Not Eligible";

        double attendancePercentage = attendanceList.stream()
                .mapToDouble(a -> (a.getAttendedClasses() * 100.0) / a.getTotalClasses())
                .average()
                .orElse(0);

        int totalMarks = marksList.stream()
                .mapToInt(Marks::getInternalMarks)
                .sum();

        return (attendancePercentage >= 75 && totalMarks >= 40)
                ? "Eligible ✅"
                : "Not Eligible ❌";
    }

    // =============================
    // 🔥 NEW: GET HALL TICKET DATA (JSON)
    // =============================
    @GetMapping("/hallticket-data/{id}")
    public Map<String, Object> getHallTicketData(@PathVariable Long id) {

        Student student = studentRepository.findById(id).orElse(null);

        if (student == null) {
            throw new RuntimeException("Student not found");
        }

        List<Marks> marksList = marksRepository.findByStudentId(id);

        List<Map<String, String>> subjects = marksList.stream()
                .map(m -> Map.of(
                        "name", m.getSubjectName(),
                        "date", m.getExamDate() != null ? m.getExamDate().toString() : "TBD"
                ))
                .collect(Collectors.toList());

        return Map.of(
                "name", student.getName(),
                "rollNo", student.getRollNo(),
                "department", student.getDepartment(),
                "semester", student.getSemester(),
                "subjects", subjects
        );
    }

    // =============================
    // PDF DOWNLOAD (KEEP THIS)
    // =============================
    @GetMapping("/hallticket/{id}")
    public ResponseEntity<?> downloadHallTicket(@PathVariable Long id) throws Exception {

        Student student = studentRepository.findById(id).orElseThrow();

        if (student.getFeePaid() == 0) {
            return ResponseEntity.badRequest().body("Fee not paid ❌");
        }

        List<Attendance> attendanceList = attendanceRepository.findByStudentId(id);
        List<Marks> marksList = marksRepository.findByStudentId(id);

        if (attendanceList.isEmpty() || marksList.isEmpty()) {
            return ResponseEntity.badRequest().body("Not Eligible ❌");
        }

        double attendancePercentage = attendanceList.stream()
                .mapToDouble(a -> (a.getAttendedClasses() * 100.0) / a.getTotalClasses())
                .average()
                .orElse(0);

        int totalMarks = marksList.stream()
                .mapToInt(Marks::getInternalMarks)
                .sum();

        if (attendancePercentage < 75 || totalMarks < 40) {
            return ResponseEntity.badRequest().body("Not Eligible ❌");
        }

        byte[] pdf = hallTicketService.generateHallTicket(student, attendanceList);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=hallticket.pdf")
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }

    // =============================
    // 🔐 SEND OTP
    // =============================
    @PostMapping("/send-otp")
    public Map<String, String> sendOtp(@RequestBody Map<String, String> data) {

        String rollNo = data.get("rollNo");

        Student student = studentRepository.findByRollNo(rollNo);

        if (student == null) throw new RuntimeException("User not found");

        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);

        student.setOtp(otp);
        student.setOtpExpiry(System.currentTimeMillis() + 5 * 60 * 1000);

        studentRepository.save(student);

        // Optional: keep console log (useful for debugging)
        System.out.println("OTP: " + otp);

        // ✅ RETURN OTP TO FRONTEND (for demo)
        return Map.of(
            "message", "OTP sent successfully",
            "otp", otp
        );
    }

    // =============================
    // 🔐 VERIFY OTP
    // =============================
    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody Map<String, String> data) {

        String rollNo = data.get("rollNo");
        String otp = data.get("otp");
        String newPassword = data.get("newPassword");

        Student student = studentRepository.findByRollNo(rollNo);

        if (student == null) throw new RuntimeException("User not found");

        if (!student.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP ❌");
        }

        if (System.currentTimeMillis() > student.getOtpExpiry()) {
            throw new RuntimeException("OTP expired ⏳");
        }

        student.setPassword(newPassword);
        student.setOtp(null);
        student.setOtpExpiry(null);

        studentRepository.save(student);

        return "Password reset successful ✅";
    }

    // =============================
    // GET ONLY STUDENTS
    // =============================
    @GetMapping("/students-only")
    public List<Student> getOnlyStudents() {
        return studentRepository.findByRole("STUDENT");
    }
    
 // =============================
 // UPDATE STUDENT
 // =============================
 @PutMapping("/update/{id}")
 public Student updateStudent(@PathVariable Long id, @RequestBody Student updatedStudent) {

     Student student = studentRepository.findById(id).orElseThrow();

     student.setName(updatedStudent.getName());
     student.setRollNo(updatedStudent.getRollNo());
     student.setPassword(updatedStudent.getPassword());
     student.setDepartment(updatedStudent.getDepartment());
     student.setSemester(updatedStudent.getSemester());
     student.setRole(updatedStudent.getRole());
     student.setFeePaid(updatedStudent.getFeePaid());

     return studentRepository.save(student);
 }


 // =============================
 // DELETE STUDENT
 // =============================
 @DeleteMapping("/delete/{id}")
 public String deleteStudent(@PathVariable Long id) {
     studentRepository.deleteById(id);
     return "Deleted Successfully";
 }
}