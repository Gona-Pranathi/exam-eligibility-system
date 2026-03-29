package entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    // 🔥 RENAMED (better naming)
    private String subjectName;

    private int internalMarks;

    // 🔥 NEW FIELD (for hallticket)
    private LocalDate examDate;

    // =============================
    // GETTERS
    // =============================
    public Long getId() { return id; }

    public Long getStudentId() { return studentId; }

    public String getSubjectName() { return subjectName; }

    public int getInternalMarks() { return internalMarks; }

    public LocalDate getExamDate() { return examDate; }

    // =============================
    // SETTERS
    // =============================
    public void setId(Long id) { this.id = id; }

    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public void setInternalMarks(int internalMarks) { this.internalMarks = internalMarks; }

    public void setExamDate(LocalDate examDate) { this.examDate = examDate; }
}