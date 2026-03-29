package dto;

import java.util.List;

public class HallTicketResponse {

    private String name;
    private String rollNo;
    private String department;
    private Integer semester;
    private List<SubjectDTO> subjects;

    // getters & setters

    public static class SubjectDTO {
        private String name;
        private String date;

        public SubjectDTO(String name, String date) {
            this.name = name;
            this.date = date;
        }

        // getters & setters
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public List<SubjectDTO> getSubjects() { return subjects; }
    public void setSubjects(List<SubjectDTO> subjects) { this.subjects = subjects; }
}