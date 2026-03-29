package service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import entity.Attendance;
import entity.Eligibility;
import entity.Marks;
import repository.AttendanceRepository;
import repository.EligibilityRepository;
import repository.MarksRepository;

@Service
public class EligibilityService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private EligibilityRepository eligibilityRepository;

    public Eligibility checkEligibility(Long studentId) {

        List<Attendance> attendanceList = attendanceRepository.findByStudentId(studentId);
        List<Marks> marksList = marksRepository.findByStudentId(studentId);

        if(attendanceList.isEmpty() || marksList.isEmpty()){
            Eligibility e = new Eligibility();
            e.setStudentId(studentId);
            e.setEligible(false);
            e.setReason("No attendance or marks data");

            return eligibilityRepository.save(e);
        }

        double attendancePercentage = attendanceList.stream()
                .mapToDouble(a -> (a.getAttendedClasses() * 100.0) / a.getTotalClasses())
                .average()
                .orElse(0);

        int totalMarks = marksList.stream()
                .mapToInt(Marks::getInternalMarks)
                .sum();

        Eligibility eligibility = new Eligibility();
        eligibility.setStudentId(studentId);

        if (attendancePercentage >= 75 && totalMarks >= 40) {
            eligibility.setEligible(true);
            eligibility.setReason("Eligible");
        } else {
            eligibility.setEligible(false);
            eligibility.setReason("Low attendance or marks");
        }

        return eligibilityRepository.save(eligibility);
    }
}