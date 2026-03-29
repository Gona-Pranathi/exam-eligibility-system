package service;

import java.io.ByteArrayOutputStream;
import java.util.List;

import org.springframework.stereotype.Service;

import entity.Student;
import entity.Attendance;

import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.*;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;

@Service
public class HallTicketService {

    public byte[] generateHallTicket(Student student, List<Attendance> attendanceList) throws Exception {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document doc = new Document(pdf);

        // =============================
        // TITLE
        // =============================
        doc.add(new Paragraph("ANURAG UNIVERSITY")
                .setBold()
                .setFontSize(18)
                .setTextAlignment(TextAlignment.CENTER));

        doc.add(new Paragraph("EXAMINATION HALL TICKET")
                .setTextAlignment(TextAlignment.CENTER));

        doc.add(new Paragraph("\n"));

        // =============================
        // STUDENT DETAILS
        // =============================
        Table studentTable = new Table(2);

        studentTable.addCell(new Cell().add(new Paragraph("Name")));
        studentTable.addCell(new Cell().add(new Paragraph(student.getName())));

        studentTable.addCell(new Cell().add(new Paragraph("Roll No")));
        studentTable.addCell(new Cell().add(new Paragraph(student.getRollNo())));

        studentTable.addCell(new Cell().add(new Paragraph("Department")));
        studentTable.addCell(new Cell().add(new Paragraph(student.getDepartment())));

        studentTable.addCell(new Cell().add(new Paragraph("Semester")));
        studentTable.addCell(new Cell().add(new Paragraph(String.valueOf(student.getSemester()))));

        doc.add(studentTable);

        doc.add(new Paragraph("\n"));

        // =============================
        // SUBJECTS + DATES
        // =============================
        Table table = new Table(2);

        table.addCell(new Cell().add(new Paragraph("Subject")).setBold());
        table.addCell(new Cell().add(new Paragraph("Exam Date")).setBold());

        int day = 10;

        for (Attendance a : attendanceList) {

            table.addCell(new Cell().add(new Paragraph(a.getSubject())));

            // 🔥 SAMPLE DYNAMIC DATE
            table.addCell(new Cell().add(new Paragraph("2026-04-" + day)));

            day++;
        }

        doc.add(table);

        doc.add(new Paragraph("\n"));

        // =============================
        // INSTRUCTIONS
        // =============================
        doc.add(new Paragraph("Instructions").setBold());

        doc.add(new Paragraph("1. Carry Hall Ticket"));
        doc.add(new Paragraph("2. Carry ID Card"));
        doc.add(new Paragraph("3. No malpractice"));

        doc.add(new Paragraph("\n\n"));

        // =============================
        // SIGNATURE
        // =============================
        doc.add(new Paragraph("Signature of Controller of Examinations")
                .setTextAlignment(TextAlignment.RIGHT));

        doc.close();

        return out.toByteArray();
    }
}