package service;

import dto.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.*;
import com.itextpdf.layout.element.*;

@Service
public class StudentService {

    public byte[] generateHallTicket(StudentRequest request) throws Exception {

        double attended = 0, total = 0;

        for (Attendance a : request.getAttendance()) {
            attended += a.getAttended();
            total += a.getTotal();
        }

        double percentage = (attended / total) * 100;

        if (percentage < 75) {
            throw new RuntimeException("Not eligible for hall ticket");
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document doc = new Document(pdf);

        doc.add(new Paragraph("ANURAG UNIVERSITY").setBold().setFontSize(16));
        doc.add(new Paragraph("EXAMINATION HALL TICKET"));

        // Student Details
        Table studentTable = new Table(2);
        studentTable.addCell("Name");
        studentTable.addCell(request.getName());
        studentTable.addCell("Roll No");
        studentTable.addCell(request.getRollNo());
        studentTable.addCell("Department");
        studentTable.addCell(request.getDepartment());
        studentTable.addCell("Semester");
        studentTable.addCell(request.getSemester());

        doc.add(studentTable);

        // Subjects Table
        Table table = new Table(2);
        table.addCell("Subject").setBold();
        table.addCell("Exam Date").setBold();

        for (Subject s : request.getSubjects()) {
            table.addCell(s.getName());
            table.addCell(s.getDate());
        }

        doc.add(table);

        doc.add(new Paragraph("Attendance: " + String.format("%.2f", percentage) + "%"));

        doc.close();

        return out.toByteArray();
    }
}