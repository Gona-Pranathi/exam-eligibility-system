package controller;

import entity.HallTicket;
import entity.Student;
import entity.Marks;
import entity.Attendance;

import repository.AttendanceRepository;
import repository.HallTicketRepository;
import repository.StudentRepository;
import repository.MarksRepository;

import service.EligibilityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.io.ByteArrayOutputStream;
import java.util.List;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private EligibilityService eligibilityService;

    @Autowired
    private HallTicketRepository hallTicketRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    // =============================
    // CHECK ELIGIBILITY
    // =============================
    @PostMapping("/checkEligibility/{studentId}")
    public String checkEligibility(@PathVariable Long studentId) {
        eligibilityService.checkEligibility(studentId);
        return "Eligibility checked";
    }

    // =============================
    // GENERATE HALL TICKET
    // =============================
    @PostMapping("/generateHallTicket/{studentId}")
    public Object generateHallTicket(@PathVariable Long studentId) {

        Student student = studentRepository.findById(studentId).orElse(null);

        if (student == null) return "Student not found";

        List<Attendance> attendanceList = attendanceRepository.findByStudentId(studentId);
        List<Marks> marksList = marksRepository.findByStudentId(studentId);

        if (attendanceList.isEmpty() || marksList.isEmpty()) {
            return "Not Eligible ❌";
        }

        double attendancePercentage = attendanceList.stream()
                .mapToDouble(a -> (a.getAttendedClasses() * 100.0) / a.getTotalClasses())
                .average()
                .orElse(0);

        int totalMarks = marksList.stream()
                .mapToInt(Marks::getInternalMarks)
                .sum();

        if (attendancePercentage < 75 || totalMarks < 40) {
            return "Not Eligible ❌";
        }

        HallTicket hallTicket = new HallTicket();

        hallTicket.setStudentId(studentId);
        hallTicket.setStudentName(student.getName());
        hallTicket.setDepartment(student.getDepartment());
        hallTicket.setSemester(student.getSemester());

        hallTicket.setHallTicketNumber("AU2026" + studentId);
        hallTicket.setExamCenter("Anurag University");

        return hallTicketRepository.save(hallTicket);
    }

    // =============================
    // GET HALL TICKET
    // =============================
    @GetMapping("/hallTicket/{studentId}")
    public HallTicket getHallTicket(@PathVariable Long studentId) {

        return hallTicketRepository.findAll()
                .stream()
                .filter(h -> h.getStudentId().equals(studentId))
                .findFirst()
                .orElse(null);
    }

    // =============================
    // DOWNLOAD PDF
    // =============================
    @GetMapping("/hallTicket/pdf/{studentId}")
    public ResponseEntity<byte[]> downloadHallTicket(@PathVariable Long studentId) throws Exception {

        HallTicket hallTicket = getHallTicket(studentId);

        if (hallTicket == null) return ResponseEntity.notFound().build();

        Student student = studentRepository.findById(studentId).orElse(null);

        List<Marks> marksList = marksRepository.findByStudentId(studentId);

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("ANURAG UNIVERSITY"));
        document.add(new Paragraph("Hall Ticket"));
        document.add(new Paragraph("--------------------------"));

        document.add(new Paragraph("Name: " + student.getName()));
        document.add(new Paragraph("Department: " + student.getDepartment()));
        document.add(new Paragraph("Semester: " + student.getSemester()));

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Subjects"));

        for (Marks m : marksList) {
            document.add(new Paragraph(
                m.getSubjectName() + " - " +
                (m.getExamDate() != null ? m.getExamDate().toString() : "TBD")
            ));
        }

        document.close();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=hallticket.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(out.toByteArray());
    }
}