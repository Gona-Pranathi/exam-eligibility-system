import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import {
  Card,
  Input,
  Button,
  Select,
  Typography,
  Space,
  Row,
  Col,
  Tag,
  Table,
  Popconfirm
} from "antd";
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

const { Title } = Typography;
const { Option } = Select;

function AdminPanel() {

  // 🔥 STATES
  const [student, setStudent] = useState({
    name: "",
    rollNo: "",
    password: "",
    semester: "",
    department: "",
    role: "STUDENT",
    feePaid: "0"
  });

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);

  // 🔥 FETCH FUNCTION
  const fetchStudents = () => {
    API.get("/students/all")
      .then(res => setStudents(res.data))
      .catch(() => toast.error("Error loading data ❌"));
  };

  // 🔥 LOAD DATA
  useEffect(() => {
    fetchStudents();
  }, []);

  // 📊 ANALYTICS
  const total = students.length;
  const paid = students.filter(s => s.feePaid == 1).length;
  const pending = students.filter(s => s.feePaid != 1).length;

  const highRisk = pending > total * 0.4;

  const feeData = [
    { name: "Paid", value: paid },
    { name: "Pending", value: pending }
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  const deptMap = {};
  students.forEach(s => {
    if (!deptMap[s.department]) deptMap[s.department] = 0;
    deptMap[s.department]++;
  });

  const deptData = Object.keys(deptMap).map(d => ({
    department: d,
    count: deptMap[d]
  }));

  // 🔍 SEARCH
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  // ➕ FORM CHANGE
  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  // ➕ ADD / UPDATE
  const addStudent = async () => {
  try {
    const payload = {
      ...student,
      semester: parseInt(student.semester) || 1,
      feePaid: Number(student.feePaid) === 1 ? 1 : 0
    };

    if (editingStudent) {
      await API.put(`/students/update/${editingStudent.id}`, payload);
      toast.success("Student Updated ✏️");
    } else {
      await API.post("/students/add", payload);
      toast.success("Student Added ✅");
    }

    fetchStudents();
    setEditingStudent(null);

    setStudent({
      name: "",
      rollNo: "",
      password: "",
      semester: "",
      department: "",
      role: "STUDENT",
      feePaid: "0"
    });

  } catch (err) {
    console.error(err);
    toast.error("Operation failed ❌");
  }
};

  // ❌ DELETE
  const deleteStudent = async (id) => {
  try {
    await API.delete(`/students/delete/${id}`);
    toast.success("Student Deleted ✅");
    fetchStudents();
  } catch (err) {
    console.error(err);
    toast.error("Delete failed ❌ (Check backend)");
  }
};

  // 📋 TABLE
  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Roll No", dataIndex: "rollNo" },
    { title: "Dept", dataIndex: "department" },
    { title: "Semester", dataIndex: "semester" },
    {
      title: "Fee",
      render: (_, record) => (
        <Tag color={record.feePaid == 1 ? "green" : "red"}>
          {record.feePaid == 1 ? "Paid" : "Pending"}
        </Tag>
      )
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingStudent(record);
              setStudent({
                ...record,
                semester: String(record.semester),
                feePaid: String(record.feePaid)
              });
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete student?"
            onConfirm={() => deleteStudent(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: "30px" }}>

      {/* 🔥 HEADER */}
      <Title
        style={{
          fontWeight: 800,
          background: "linear-gradient(90deg, #22c55e, #06b6d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        🛠 Admin Dashboard
      </Title>

      {/* 📊 KPI */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}><Card>👨‍🎓 Total: {total}</Card></Col>
        <Col span={8}><Card>💰 Paid: {paid}</Card></Col>
        <Col span={8}><Card>⚠ Pending: {pending}</Card></Col>
      </Row>

      {/* 🚨 AI */}
      <Card style={{ marginBottom: 20 }}>
        {highRisk ? (
          <Tag color="red">🚨 High unpaid students!</Tag>
        ) : (
          <Tag color="green">✅ System healthy</Tag>
        )}
      </Card>

      {/* 💰 PIE */}
      <Card title="Fee Distribution" style={{ marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={feeData} dataKey="value">
              {feeData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* 📚 BAR */}
      <Card title="Department Stats" style={{ marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={deptData}>
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 👨‍🎓 TABLE */}
      <Card title="Manage Students" style={{ marginBottom: 20 }}>
        <Input
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 15 }}
        />

        <Table columns={columns} dataSource={filteredStudents} rowKey="id" />
      </Card>

      {/* ➕ FORM (LAST) */}
      <Card title="Add / Update Student" style={{ marginTop: 20 }}>
        <Space direction="vertical" style={{ width: "100%" }}>

          <Input name="name" placeholder="Name" value={student.name} onChange={handleChange} />
          <Input name="rollNo" placeholder="Roll No" value={student.rollNo} onChange={handleChange} />
          <Input name="password" placeholder="Password" value={student.password} onChange={handleChange} />
          <Input name="semester" placeholder="Semester" value={student.semester} onChange={handleChange} />
          <Input name="department" placeholder="Department" value={student.department} onChange={handleChange} />

          <Select value={student.role} onChange={(v) => setStudent({ ...student, role: v })}>
            <Option value="STUDENT">Student</Option>
            <Option value="FACULTY">Faculty</Option>
            <Option value="ADMIN">Admin</Option>
          </Select>

          <Select value={student.feePaid} onChange={(v) => setStudent({ ...student, feePaid: v })}>
            <Option value="0">Not Paid</Option>
            <Option value="1">Paid</Option>
          </Select>

          <Button type="primary" onClick={addStudent}>
            {editingStudent ? "Update Student" : "Add Student"}
          </Button>

        </Space>
      </Card>

    </div>
  );
}

export default AdminPanel;