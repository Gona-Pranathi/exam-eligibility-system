import React, { useState } from "react";
import API from "../services/api";

function Faculty() {

  const [marks, setMarks] = useState({
    studentId: "",
    subjectName: "",
    internalMarks: "",
    examDate: ""
  });

  const [attendance, setAttendance] = useState({
    studentId: "",
    subject: "",
    attendedClasses: "",
    totalClasses: ""
  });

  // ✅ ADD MARKS
  const addMarks = async () => {
    try {
      await API.post("/marks/add", marks);
      alert("Marks added ✅");

      // 🔄 reset form
      setMarks({
        studentId: "",
        subjectName: "",
        internalMarks: "",
        examDate: ""
      });

    } catch (err) {
      alert("Error adding marks ❌");
      console.error(err);
    }
  };

  // ✅ ADD ATTENDANCE
  const addAttendance = async () => {
    try {
      await API.post("/attendance/add", attendance);
      alert("Attendance added ✅");

      setAttendance({
        studentId: "",
        subject: "",
        attendedClasses: "",
        totalClasses: ""
      });

    } catch (err) {
      alert("Error adding attendance ❌");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Faculty Dashboard</h2>

      {/* ================= MARKS ================= */}
      <h3>Add Marks</h3>

      <input
        placeholder="Student ID"
        value={marks.studentId}
        onChange={(e) =>
          setMarks({ ...marks, studentId: e.target.value })
        }
      />

      <input
        placeholder="Subject Name"
        value={marks.subjectName}
        onChange={(e) =>
          setMarks({ ...marks, subjectName: e.target.value })
        }
      />

      <input
        placeholder="Marks"
        value={marks.internalMarks}
        onChange={(e) =>
          setMarks({ ...marks, internalMarks: e.target.value })
        }
      />

      <input
        placeholder="Exam Date (YYYY-MM-DD)"
        value={marks.examDate}
        onChange={(e) =>
          setMarks({ ...marks, examDate: e.target.value })
        }
      />

      <br /><br />

      <button onClick={addMarks}>Add Marks</button>

      {/* ================= ATTENDANCE ================= */}
      <h3 style={{ marginTop: "30px" }}>Add Attendance</h3>

      <input
        placeholder="Student ID"
        value={attendance.studentId}
        onChange={(e) =>
          setAttendance({ ...attendance, studentId: e.target.value })
        }
      />

      <input
        placeholder="Subject"
        value={attendance.subject}
        onChange={(e) =>
          setAttendance({ ...attendance, subject: e.target.value })
        }
      />

      <input
        placeholder="Attended Classes"
        value={attendance.attendedClasses}
        onChange={(e) =>
          setAttendance({ ...attendance, attendedClasses: e.target.value })
        }
      />

      <input
        placeholder="Total Classes"
        value={attendance.totalClasses}
        onChange={(e) =>
          setAttendance({ ...attendance, totalClasses: e.target.value })
        }
      />

      <br /><br />

      <button onClick={addAttendance}>Add Attendance</button>
    </div>
  );
}

export default Faculty;