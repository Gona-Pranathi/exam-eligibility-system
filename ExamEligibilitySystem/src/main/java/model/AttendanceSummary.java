package model;

import java.util.List;

public class AttendanceSummary {

    private Long studentId;
    private double overallAttendance;
    private List<AttendanceSubject> subjects;

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public double getOverallAttendance() {
        return overallAttendance;
    }

    public void setOverallAttendance(double overallAttendance) {
        this.overallAttendance = overallAttendance;
    }

    public List<AttendanceSubject> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<AttendanceSubject> subjects) {
        this.subjects = subjects;
    }
}