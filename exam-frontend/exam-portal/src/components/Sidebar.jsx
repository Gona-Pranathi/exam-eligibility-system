import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div style={sidebar}>

      <h2 style={{ color: "white" }}>🎓 Exam Portal</h2>

      <NavLink to="/dashboard" style={link}>Dashboard</NavLink>
      <NavLink to="/attendance" style={link}>Attendance</NavLink>
      <NavLink to="/marks" style={link}>Marks</NavLink>
      <NavLink to="/hallticket" style={link}>Hall Ticket</NavLink>
      <link to="/admin">Admin Panel</link>

    </div>
  );
}

const sidebar = {
  width: "220px",
  padding: "20px",
  background: "#0f172a",
  height: "100vh"
};

const link = {
  display: "block",
  marginTop: "15px",
  color: "white",
  textDecoration: "none",
  cursor: "pointer"
};

export default Sidebar;