import React from "react";
import { Card, Tag, Row, Col, Progress } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import PropTypes from "prop-types";

function FacultyAnalytics({ marks = [], attendance = [] }) {

  // 📊 FORMAT MARKS DATA (✅ FIXED subjectName)
  const marksData = marks.map(m => ({
    subject: m.subjectName,
    marks: Number(m.internalMarks || 0)
  }));

  // 📊 FORMAT ATTENDANCE DATA
  const attendanceData = attendance.map(a => {
    const percent =
      a.totalClasses === 0
        ? 0
        : (a.attendedClasses / a.totalClasses) * 100;

    return {
      subject: a.subject,
      attendance: Number(percent.toFixed(0))
    };
  });

  // 🧠 PERFORMANCE SCORE
  const performance = marksData.map(m => {
    const att = attendanceData.find(a => a.subject === m.subject);
    const attendancePercent = att ? att.attendance : 0;

    const score = (m.marks * 0.6) + (attendancePercent * 0.4);

    return {
      subject: m.subject,
      score: Number(score.toFixed(0))
    };
  });

  // ⚠ SAFE SORT (avoid mutating original)
  const sortedDesc = [...performance].sort((a, b) => b.score - a.score);
  const sortedAsc = [...performance].sort((a, b) => a.score - b.score);

  const top = sortedDesc[0];
  const weak = sortedAsc[0];

  const risky = performance.filter(p => p.score < 50);
  const warning = performance.filter(p => p.score >= 50 && p.score < 70);

  return (
    <>

      {/* 🎯 PERFORMANCE SCORE */}
      <Card title="🎯 Overall Performance Score" style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          {performance.map((p, i) => (
            <Col span={8} key={i}>
              <Card>
                <b>{p.subject}</b>
                <Progress percent={p.score} />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 📊 ATTENDANCE */}
      <Card title="📊 Attendance Trends" style={{ marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={attendanceData}>
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="attendance" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* 📚 MARKS */}
      <Card title="📚 Marks Distribution" style={{ marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={marksData}>
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="marks" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 🧠 AI INSIGHTS */}
      <Card title="🧠 Smart Insights">

        {top && (
          <p>
            🏆 Best Subject:{" "}
            <Tag color="green">{top.subject} ({top.score})</Tag>
          </p>
        )}

        {weak && (
          <p>
            ❌ Weak Subject:{" "}
            <Tag color="red">{weak.subject} ({weak.score})</Tag>
          </p>
        )}

        {risky.length > 0 && (
          <>
            <h4>🚨 High Risk Subjects</h4>
            {risky.map((r, i) => (
              <Tag color="red" key={i}>{r.subject}</Tag>
            ))}
          </>
        )}

        {warning.length > 0 && (
          <>
            <h4>⚠ Needs Improvement</h4>
            {warning.map((w, i) => (
              <Tag color="orange" key={i}>{w.subject}</Tag>
            ))}
          </>
        )}

        {risky.length === 0 && warning.length === 0 && (
          <Tag color="green">Excellent Performance ✅</Tag>
        )}

        <br /><br />

        <p style={{ fontWeight: "bold" }}>
          💡 Suggestion:
          {risky.length > 0
            ? " Focus on weak subjects immediately."
            : warning.length > 0
            ? " Improve consistency in mid-level subjects."
            : " Keep maintaining your performance."}
        </p>

      </Card>

    </>
  );
}

export default FacultyAnalytics;

// ✅ FIX ESLINT
FacultyAnalytics.propTypes = {
  marks: PropTypes.array,
  attendance: PropTypes.array
};