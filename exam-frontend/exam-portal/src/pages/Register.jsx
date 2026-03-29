import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Input, Button, Form } from "antd";
import { toast } from "react-toastify";

function Register() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    setLoading(true);

    try {
      const res = await API.post("/students/add", values);

      localStorage.setItem("student", JSON.stringify(res.data));

      toast.success("Registered Successfully 🎉");

      navigate("/dashboard");

    } catch {
      toast.error("Registration Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>

      <h2>🆕 Register</h2>

      <Form onFinish={handleRegister} style={{ maxWidth: 400, margin: "auto" }}>

        <Form.Item name="name" rules={[{ required: true }]}>
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item name="rollNo" rules={[{ required: true }]}>
          <Input placeholder="Roll No" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item name="department">
          <Input placeholder="Department" />
        </Form.Item>

        <Form.Item name="semester">
          <Input placeholder="Semester" />
        </Form.Item>

        <Button htmlType="submit" loading={loading} block>
          Register
        </Button>

      </Form>

    </div>
  );
}

export default Register;