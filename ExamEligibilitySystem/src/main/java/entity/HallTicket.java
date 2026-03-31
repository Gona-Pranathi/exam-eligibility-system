package entity;

import jakarta.persistence.*;

@Entity
public class HallTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    private String studentName;

    private String department;

    private Integer semester;

    private String hallTicketNumber;

    private String examCenter;

    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getDepartment() {
        return department;
    }

    public Integer getSemester() {
        return semester;
    }

    public String getHallTicketNumber() {
        return hallTicketNumber;
    }

    public String getExamCenter() {
        return examCenter;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public void setHallTicketNumber(String hallTicketNumber) {
        this.hallTicketNumber = hallTicketNumber;
    }

    public void setExamCenter(String examCenter) {
        this.examCenter = examCenter;
    }
}