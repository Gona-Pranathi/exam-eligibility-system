import React from "react";
import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function AnalyticsChart({ data }) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
  dataKey="subject"
  tick={{ fill: "#000" }}
/>

<YAxis 
  tick={{ fill: "#000" }}
/>
          <Tooltip />
          <Bar dataKey="attendance" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

AnalyticsChart.propTypes = {
  data: PropTypes.array
};

export default AnalyticsChart;