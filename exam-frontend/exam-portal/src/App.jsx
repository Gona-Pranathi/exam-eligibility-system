import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Marks from "./pages/Marks";
import HallTicket from "./pages/HallTicket";
import AdminPanel from "./pages/AdminPanel";
import FacultyPanel from "./pages/FacultyPanel";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./pages/ForgotPassword";
import "./App.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/marks" element={<Marks />} />
            <Route path="/hallticket" element={<HallTicket />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/faculty" element={<FacultyPanel />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;