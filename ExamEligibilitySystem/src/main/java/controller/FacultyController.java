package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import entity.Attendance;
import entity.Marks;
import repository.AttendanceRepository;
import repository.MarksRepository;

@RestController
@RequestMapping("/faculty")
public class FacultyController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MarksRepository marksRepository;

    @PostMapping("/addAttendance")
    public Attendance addAttendance(@RequestBody Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    @PostMapping("/addMarks")
    public Marks addMarks(@RequestBody Marks marks) {
        return marksRepository.save(marks);
    }
}