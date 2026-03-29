import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Card, Button, Tag, Space } from "antd";
import { toast } from "react-toastify";
import AnalyticsChart from "../components/AnalyticsChart";

function Dashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [status, setStatus] = useState("");
  const [attendancePercent, setAttendancePercent] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [riskLevel, setRiskLevel] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("student"));

    if (!stored) return;

    // ✅ FETCH STUDENT
    API.get(`/students/all`)
      .then(res => {
        const latest = res.data.find(s => s.id === stored.id);
        setStudent(latest);
      })
      .catch(() => toast.error("Error loading student ❌"));

    // ✅ FETCH ATTENDANCE (FIXED URL)
    API.get(`/students/attendance/${stored.id}`)
      .then(res => {

        let totalAttended = 0;
        let totalClasses = 0;

        // 📊 CHART DATA
        const formatted = res.data.map(a => {
          const percent =
            a.totalClasses === 0
              ? 0
              : (a.attendedClasses / a.totalClasses) * 100;

          return {
            subject: a.subject || "Unknown",
            attendance: Number(percent.toFixed(0))
          };
        });

        setChartData(formatted);

        // 📈 TOTAL %
        res.data.forEach(a => {
          totalAttended += a.attendedClasses;
          totalClasses += a.totalClasses;
        });

        let percent =
          totalClasses === 0
            ? 0
            : (totalAttended / totalClasses) * 100;

        if (percent > 100) percent = 100;

        setAttendancePercent(percent);

        // 🧠 AI LOGIC
        if (percent < 60) {
          setRiskLevel("CRITICAL");
        } else if (percent < 75) {
          setRiskLevel("WARNING");
        } else {
          setRiskLevel("SAFE");
        }

      })
      .catch(() => toast.error("Error loading attendance ❌"));

  }, []);

  const checkEligibility = async () => {
    try {
      const res = await API.get(`/students/eligibility/${student?.id}`);
      setStatus(res.data);
      toast.success("Checked successfully ✅");
    } catch {
      toast.error("Error checking eligibility ❌");
    }
  };

  if (!student) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "30px" }}>

      {/* 🔥 WELCOME */}
      <h2>Welcome back, {student?.name} 👋</h2>
      <p style={{ color: "#888" }}>
        Heres your academic overview
      </p>

      <br />

      {/* 🔥 STATS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>

        <Card style={{ flex: 1, textAlign: "center" }}>
          📊 Attendance <br />
          <span style={{
            color: attendancePercent >= 75 ? "green" : "red",
            fontWeight: "bold",
            fontSize: "18px"
          }}>
            {attendancePercent.toFixed(2)}%
          </span>
        </Card>

        <Card style={{ flex: 1, textAlign: "center" }}>
          📚 Semester <br />
          <b>{student?.semester}</b>
        </Card>

        <Card style={{ flex: 1, textAlign: "center" }}>
          🎯 Fee Status <br />
          <b>{student?.feePaid === 1 ? "Paid" : "Pending"}</b>
        </Card>
      </div>

      {/* 🚨 AI ALERT */}
      {riskLevel !== "SAFE" && (
        <Card
          style={{
            marginBottom: "20px",
            borderLeft: "6px solid red",
            background: "#fff1f0"
          }}
        >
          <h3 style={{ color: "red" }}>🚨 Attendance Alert</h3>

          {riskLevel === "CRITICAL" && (
            <p>Attendance is critically low! Immediate action required.</p>
          )}

          {riskLevel === "WARNING" && (
            <p>Attendance is below 75%. Try to improve soon.</p>
          )}
        </Card>
      )}

      {/* 📊 CHART */}
      <Card title="📊 Attendance Analytics" style={{ marginBottom: "20px" }}>
        <AnalyticsChart data={chartData} />
      </Card>

      {/* 🧠 AI INSIGHTS */}
      <Card title="🧠 AI Insights" style={{ marginBottom: "20px" }}>

        {riskLevel === "SAFE" && (
          <p style={{ color: "green" }}>
            ✅ You are doing great! Keep maintaining your attendance.
          </p>
        )}

        {riskLevel === "WARNING" && (
          <p style={{ color: "orange" }}>
            ⚠ You need to attend more classes to stay eligible.
          </p>
        )}

        {riskLevel === "CRITICAL" && (
          <p style={{ color: "red" }}>
            🚨 High risk! You may lose eligibility for exams.
          </p>
        )}

      </Card>

      {/* 📦 STUDENT INFO */}
      <Card style={{ marginBottom: "20px" }}>
        <p><b>Name:</b> {student?.name}</p>
        <p><b>Roll No:</b> {student?.rollNo}</p>
        <p><b>Semester:</b> {student?.semester}</p>

        <Tag color={student?.feePaid === 1 ? "green" : "red"}>
          {student?.feePaid === 1 ? "Fee Paid ✅" : "Not Paid ❌"}
        </Tag>
      </Card>

      {/* 🚀 ACTIONS */}
      <Card title="Quick Actions">
        <Space direction="vertical" style={{ width: "100%" }}>

          <Button type="primary" onClick={() => navigate("/attendance")}>
            📊 View Attendance
          </Button>

          <Button type="primary" onClick={() => navigate("/marks")}>
            📚 View Marks
          </Button>

          <Button type="primary" onClick={checkEligibility}>
            ✅ Check Eligibility
          </Button>

          <Button
            type="primary"
            disabled={student?.feePaid !== 1}
            onClick={() => navigate("/hallticket")}
          >
            🎟 Download Hall Ticket
          </Button>

        </Space>

        <br />

        <h3>{status}</h3>

        {student?.feePaid !== 1 && (
          <p style={{ color: "red" }}>
            ⚠ Please pay fee to download hall ticket
          </p>
        )}
      </Card>

    </div>
  );
}

export default Dashboard;