import React, { useEffect, useState } from "react";
import API from "../services/api";
import AttendanceChart from "../components/AttendanceChart";

function Attendance() {

  const [data, setData] = useState([]);
  const [overall, setOverall] = useState(0);

  // 🔥 NEW STATES (for AI)
  const [totalAttended, setTotalAttended] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);

  useEffect(() => {

    const student = JSON.parse(localStorage.getItem("student"));

    API.get(`/students/attendance/${student.id}`)
      .then(res => {

        let attended = 0;
        let total = 0;

        const formatted = res.data.map(a => {

          attended += a.attendedClasses;
          total += a.totalClasses;

          let percent = (a.attendedClasses / a.totalClasses) * 100;

          // ✅ FIX: NEVER EXCEED 100
          if (percent > 100) percent = 100;

          return {
            subject: a.subject,
            attendancePercentage: percent
          };
        });

        // ✅ SAVE FOR AI
        setTotalAttended(attended);
        setTotalClasses(total);

        // ✅ OVERALL CALCULATION (SAFE)
        let overallPercent = total === 0 ? 0 : (attended / total) * 100;

        if (overallPercent > 100) overallPercent = 100;

        setOverall(overallPercent);
        setData(formatted);
      });

  }, []);

  // 🤖 AI FUNCTION
  const getAISuggestion = () => {

    if (totalClasses === 0) {
      return "🤖 No attendance data available";
    }

    if (overall >= 75) {
      return "🤖 You are eligible. Keep maintaining attendance!";
    }

    // 🔥 AI calculation (important formula)
    let required = Math.ceil(
      (0.75 * totalClasses - totalAttended) / (1 - 0.75)
    );

    if (required < 0) required = 0;

    return `🤖 Attend at least ${required} more classes to reach 75%`;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ color: "#000" }}>Attendance</h2>

      {/* 📊 CHART */}
      <AttendanceChart data={data} />

      {/* 🔥 OVERALL */}
      <h2 style={{ color: "white", marginTop: "20px" }}>
        Overall Attendance: {overall.toFixed(2)}%
      </h2>

      {/* 🎯 ELIGIBILITY */}
      <h3 style={{ color: overall >= 75 ? "lightgreen" : "red" }}>
        {overall >= 75 ? "✅ Eligible" : "❌ Not Eligible"}
      </h3>

      {/* 🤖 AI SUGGESTION */}
      <h3 style={{ marginTop: "10px", color: "#38bdf8" }}>
        {getAISuggestion()}
      </h3>

    </div>
  );
}

export default Attendance;