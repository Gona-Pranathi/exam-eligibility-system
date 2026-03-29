import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import React from "react";
import { toast } from "react-toastify";
import {
  Input,
  Button,
  Typography,
  Form,
  Checkbox
} from "antd";
import {
  UserOutlined,
  LockOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Text } = Typography;

const cardStyle = {
  padding: "15px",
  borderRadius: "15px",
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(15px)",
  border: "1px solid rgba(255,255,255,0.2)",
  textAlign: "center",
  fontWeight: "500",
  transition: "0.3s",
  cursor: "pointer"
};

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ HANDLE LOGIN
  const handleLogin = async (values) => {
    setLoading(true);

    try {
      const res = await API.post("/students/login", values);

      if (typeof res.data === "string") {
        toast.error("Invalid Credentials ❌");
        return;
      }

      localStorage.setItem("student", JSON.stringify(res.data));
      toast.success("Login Successful 🎉");

      const role = res.data.role?.toUpperCase();

      setTimeout(() => {
        if (role === "ADMIN") navigate("/admin");
        else if (role === "FACULTY") navigate("/faculty");
        else navigate("/dashboard");
      }, 700);

    } catch (error) {
      console.error(error);
      toast.error("Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NEW: DEMO LOGIN FUNCTION
  const autoLogin = async (roleType) => {
    let credentials = {};

    if (roleType === "admin") {
      credentials = { rollNo: "admin", password: "admin123" };
    } else if (roleType === "faculty") {
      credentials = { rollNo: "faculty", password: "faculty123" };
    } else {
      credentials = { rollNo: "21A91A05F1", password: "student123" };
    }

    try {
      const res = await API.post("/students/login", credentials);

      if (typeof res.data === "string") {
        toast.error("Demo login failed ❌");
        return;
      }

      localStorage.setItem("student", JSON.stringify(res.data));

      const role = res.data.role?.toUpperCase();

      if (role === "ADMIN") navigate("/admin");
      else if (role === "FACULTY") navigate("/faculty");
      else navigate("/dashboard");

    } catch {
      toast.error("Demo login failed ❌");
    }
  };

  return (
  <div
    style={{
      height: "100vh",
      display: "flex",
      overflow: "hidden",
      background: "linear-gradient(135deg, #0f172a, #1e3a8a, #06b6d4)",
      position: "relative"
    }}
  >

    {/* 🔥 FLOATING BLOBS (UNCHANGED) */}
    <motion.div
      animate={{ x: [0, 100, -100, 0], y: [0, 50, -50, 0] }}
      transition={{ repeat: Infinity, duration: 12 }}
      style={{
        position: "absolute",
        width: "300px",
        height: "300px",
        background: "#22c55e",
        filter: "blur(120px)",
        opacity: 0.4,
        top: "-50px",
        left: "-50px"
      }}
    />

    <motion.div
      animate={{ x: [0, -100, 100, 0], y: [0, -50, 50, 0] }}
      transition={{ repeat: Infinity, duration: 15 }}
      style={{
        position: "absolute",
        width: "300px",
        height: "300px",
        background: "#06b6d4",
        filter: "blur(120px)",
        opacity: 0.4,
        bottom: "-50px",
        right: "-50px"
      }}
    />

    {/* LEFT SIDE */}
    <div
      style={{
        flex: 1,
        color: "white",
        padding: "80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >

      {/* 🔥 BACKGROUND GLOW */}
      <div style={{
        position: "absolute",
        width: "400px",
        height: "400px",
        background: "#22c55e",
        filter: "blur(150px)",
        opacity: 0.3,
        top: "-100px",
        left: "-100px"
      }} />

      <div style={{
        position: "absolute",
        width: "400px",
        height: "400px",
        background: "#06b6d4",
        filter: "blur(150px)",
        opacity: 0.3,
        bottom: "-100px",
        right: "-100px"
      }} />

      {/* 🔥 BRAND (ANIMATED) */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          fontSize: "60px",
          fontWeight: "900",
          letterSpacing: "2px",
          background: "linear-gradient(90deg, #22c55e, #06b6d4, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        EduSync 🚀
      </motion.h1>

      {/* 🔥 SUBTEXT ANIMATION */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          fontSize: "22px",
          marginTop: "10px",
          opacity: 0.9
        }}
      >
        Smart Academic Management Platform
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          marginTop: "15px",
          opacity: 0.7,
          maxWidth: "450px",
          lineHeight: "1.6"
        }}
      >
        Manage attendance, track performance, generate hall tickets,
        and streamline campus operations — all in one powerful system.
      </motion.p>

      {/* 🔥 FEATURE CARDS (ANIMATED) */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.2 }
          }
        }}
        style={{
          marginTop: "40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          maxWidth: "500px"
        }}
      >

        <motion.div
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,255,200,0.3)" }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={cardStyle}
        >
          📊 Analytics
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,255,200,0.3)" }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={cardStyle}
        >
          🎓 Students
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,255,200,0.3)" }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={cardStyle}
        >
          🧾 Hall Tickets
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,255,200,0.3)" }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={cardStyle}
        >
          ⚡ Fast System
        </motion.div>

      </motion.div>

    </div>

      {/* RIGHT LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "420px",
          margin: "auto",
          marginRight: "80px",
          padding: "40px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(25px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          textAlign: "center",
          zIndex: 2
        }}
      >
        <h2 style={{ fontWeight: "700" }}>Welcome Back 👋</h2>

        <Text style={{ color: "#ddd" }}>
          Login to your account
        </Text>

        <br /><br />

        {/* FORM */}
        <Form layout="vertical" onFinish={handleLogin}>

          <Form.Item
            name="rollNo"
            rules={[{ required: true, message: "Enter Roll Number" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Roll Number"
              size="large"
              style={{ borderRadius: "10px", height: "45px" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Enter Password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              style={{ borderRadius: "10px", height: "45px" }}
            />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <Checkbox>Remember me</Checkbox>

            <Text
              style={{ color: "#000", cursor: "pointer" }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </Text>
          </div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{
                height: "45px",
                borderRadius: "10px",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #22c55e, #06b6d4)",
                border: "none",
                color: "white"
              }}
            >
              🚀 Enter Portal
            </Button>
          </motion.div>

        </Form>

        {/* 🔥 NEW: REGISTER BUTTON */}
        <br />
        <Button block onClick={() => navigate("/register")}>
          🆕 New User? Register
        </Button>

        {/* 🔥 NEW: DEMO LOGIN */}
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "white" }}>🚀 Demo Accounts</h3>

          <Button onClick={() => autoLogin("admin")} style={{ margin: 5 }}>
            Admin
          </Button>

          <Button onClick={() => autoLogin("faculty")} style={{ margin: 5 }}>
            Faculty
          </Button>

          <Button onClick={() => autoLogin("student")} style={{ margin: 5 }}>
            Student
          </Button>

          <div style={{ fontSize: "12px", color: "#ddd", marginTop: "10px" }}>
            <p>Admin: admin / admin123</p>
            <p>Faculty: faculty / faculty123</p>
            <p>Student: 21A91A05F1 / student123</p>
            <p>⚠ Use Demo Accounts to explore all dashboards</p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

export default Login;