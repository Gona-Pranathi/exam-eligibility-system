package controller;

import entity.Attendance;
import entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import repository.AttendanceRepository;
import repository.StudentRepository;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")   // ✅ VERY IMPORTANT
@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    // ADD ATTENDANCE
    @PostMapping("/add")
    public Attendance add(@RequestBody Map<String, Object> data) {

        Long studentId = Long.valueOf(data.get("studentId").toString());
        Student s = studentRepository.findById(studentId).orElseThrow();

        Attendance a = new Attendance();
        a.setStudent(s);
        a.setSubject(data.get("subject").toString());

        // 🔥 ADD THIS PART HERE
        int attended = Integer.parseInt(data.get("attendedClasses").toString());
        int total = Integer.parseInt(data.get("totalClasses").toString());

        if (attended > total) {
            throw new RuntimeException("❌ Invalid attendance");
        }

        a.setAttendedClasses(attended);
        a.setTotalClasses(total);

        return attendanceRepository.save(a);
    }

    // ✅ GET BY STUDENT ID (THIS WAS MISSING)
    @GetMapping("/student/{id}")
    public List<Attendance> getAttendanceByStudent(@PathVariable Long id) {
        return attendanceRepository.findByStudentId(id);
    }

    @PutMapping("/update/{id}")
    public Attendance update(@PathVariable Long id, @RequestBody Attendance a) {

        Attendance existing = attendanceRepository.findById(id).orElseThrow();

        if (a.getAttendedClasses() > a.getTotalClasses()) {
            throw new RuntimeException("❌ Attended cannot exceed total");
        }

        existing.setSubject(a.getSubject());
        existing.setAttendedClasses(a.getAttendedClasses());
        existing.setTotalClasses(a.getTotalClasses());

        return attendanceRepository.save(existing);
    }
    
    @DeleteMapping("/delete/{id}")
    public String deleteAttendance(@PathVariable Long id) {
        attendanceRepository.deleteById(id);
        return "Deleted ✅";
    }
}