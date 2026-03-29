import React from "react";
import PropTypes from "prop-types";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

function AttendanceChart({ data }) {
  return (
    <BarChart width={500} height={300} data={data}>
      <XAxis dataKey="subject" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="attendancePercentage" fill="#22c55e" />
    </BarChart>
  );
}

AttendanceChart.propTypes = {
  data: PropTypes.array
};

export default AttendanceChart;