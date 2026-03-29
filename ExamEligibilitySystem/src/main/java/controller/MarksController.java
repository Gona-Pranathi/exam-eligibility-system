package controller;

import entity.Marks;
import entity.Student;
import repository.MarksRepository;
import repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/marks")
@CrossOrigin(origins = "http://localhost:5173")
public class MarksController {

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private StudentRepository studentRepository;

    // =============================
    // ADD MARKS
    // =============================
    @PostMapping("/add")
    public Marks addMarks(@RequestBody Marks marks) {

        System.out.println("Incoming Data:");
        System.out.println("StudentId: " + marks.getStudentId());
        System.out.println("Subject: " + marks.getSubjectName()); // ✅ FIXED
        System.out.println("Marks: " + marks.getInternalMarks());
        System.out.println("Exam Date: " + marks.getExamDate()); // ✅ NEW

        if (marks.getStudentId() == null) {
            throw new RuntimeException("Student ID is NULL ❌");
        }

        studentRepository.findById(marks.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student NOT FOUND"));

        return marksRepository.save(marks);
    }

    // =============================
    // GET MARKS BY STUDENT
    // =============================
    @GetMapping("/student/{id}")
    public List<Marks> getMarksByStudent(@PathVariable Long id) {
        return marksRepository.findByStudentId(id);
    }

    // =============================
    // UPDATE MARKS
    // =============================
    @PutMapping("/update/{id}")
    public Marks update(@PathVariable Long id, @RequestBody Marks m) {

        Marks existing = marksRepository.findById(id).orElseThrow();

        existing.setSubjectName(m.getSubjectName()); // ✅ FIXED
        existing.setInternalMarks(m.getInternalMarks());
        existing.setExamDate(m.getExamDate()); // ✅ NEW

        return marksRepository.save(existing);
    }
    
    @DeleteMapping("/delete/{id}")
    public String deleteMarks(@PathVariable Long id) {
        marksRepository.deleteById(id);
        return "Deleted ✅";
    }
}