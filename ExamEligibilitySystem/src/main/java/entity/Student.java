package entity;

import jakarta.persistence.*;

@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String rollNo;
    private String password;

    private String department;
    private Integer semester;

    private String role;

    private Integer feePaid; // ✅ MUST MATCH FRONTEND
    private String otp;
    private Long otpExpiry;

    // GETTERS + SETTERS

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Integer getFeePaid() { return feePaid; }
    public void setFeePaid(Integer feePaid) { this.feePaid = feePaid; }
    
    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public Long getOtpExpiry() {
        return otpExpiry;
    }

    public void setOtpExpiry(Long otpExpiry) {
        this.otpExpiry = otpExpiry;
    }
}