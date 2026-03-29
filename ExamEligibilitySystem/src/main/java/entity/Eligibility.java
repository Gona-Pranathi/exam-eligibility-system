package entity;

import jakarta.persistence.*;

@Entity
public class Eligibility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;
    private boolean eligible;
    private String reason;

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public void setEligible(boolean eligible) {
        this.eligible = eligible;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}