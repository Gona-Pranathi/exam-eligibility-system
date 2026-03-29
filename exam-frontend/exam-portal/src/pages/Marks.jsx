import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function Marks() {

  const [marks, setMarks] = useState([]);

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));

    if (!student) return;

    API.get(`/students/marks/${student.id}`)
      .then(res => {
        // ✅ FIX: map backend → chart format
        const formatted = res.data.map(m => ({
          subjectName: m.subjectName || "Unknown",
          internalMarks: Number(m.internalMarks)
        }));

        setMarks(formatted);
      })
      .catch(err => console.error("Error loading marks", err));

  }, []);

  return (
    <div style={{ padding: "20px" }}>

      <h2 style={{ color: "#000" }}>📚 Marks</h2>

      {marks.length === 0 ? (
        <p style={{ color: "white" }}>No marks available</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={marks}>
            {/* ✅ FIX HERE */}
            <XAxis 
  dataKey="subjectName"
  tick={{ fill: "#000" }}   // 👈 makes text black
/>

<YAxis 
  tick={{ fill: "#000" }}   // 👈 makes numbers black
/>
            <Tooltip />

            <Bar dataKey="internalMarks" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      )}

    </div>
  );
}

export default Marks;