import { Card, Tag, Row, Col } from "antd";
import React from "react";
import PropTypes from "prop-types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";

function AdminAnalytics({ students }) {

  // 📊 DATA
  const total = students.length;
  const paid = students.filter(s => s.feePaid === 1).length;
  const pending = students.filter(s => s.feePaid !== 1).length;

  // 🎯 PIE DATA
  const feeData = [
    { name: "Paid", value: paid },
    { name: "Pending", value: pending }
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  // 📚 DEPARTMENT ANALYTICS
  const deptMap = {};

  students.forEach(s => {
    if (!deptMap[s.department]) {
      deptMap[s.department] = 0;
    }
    deptMap[s.department]++;
  });

  const deptData = Object.keys(deptMap).map(d => ({
    department: d,
    count: deptMap[d]
  }));

  // 🧠 AI LOGIC
  const highRisk = pending > total * 0.4;

  return (
    <>

      {/* 📊 KPI */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}><Card>👨‍🎓 Total: {total}</Card></Col>
        <Col span={8}><Card>💰 Paid: {paid}</Card></Col>
        <Col span={8}><Card>⚠ Pending: {pending}</Card></Col>
      </Row>

      {/* 💰 PIE */}
      <Card title="💰 Fee Distribution" style={{ marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={feeData} dataKey="value" outerRadius={80}>
              {feeData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* 📚 DEPT CHART */}
      <Card title="📚 Department Distribution" style={{ marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={deptData}>
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 🧠 AI INSIGHTS */}
      <Card title="🧠 System Insights">

        {highRisk ? (
          <Tag color="red">
            🚨 High number of unpaid students!
          </Tag>
        ) : (
          <Tag color="green">
            ✅ Fee collection is healthy
          </Tag>
        )}

        <br /><br />

        <p>
          💡 Suggestion:{" "}
          {highRisk
            ? "Take action on pending fee students."
            : "System is stable."}
        </p>

      </Card>

    </>
  );
}

AdminAnalytics.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      feePaid: PropTypes.number,
      department: PropTypes.string
    })
  )
};

export default AdminAnalytics;