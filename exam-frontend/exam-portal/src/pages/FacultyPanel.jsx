import React, { useState, useEffect } from "react";
import API from "../services/api";
import FacultyAnalytics from "../components/FacultyAnalytics";
import {
  Card,
  Select,
  Input,
  Button,
  Table,
  Space,
  Typography,
  Tag,
  Progress,
  Row,
  Col
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import toast from "react-hot-toast";
import { Modal } from "antd";

const { Title } = Typography;
const { Option } = Select;

function FacultyPanel() {

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");

  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // ✅ SEPARATE STATES (FIXED ISSUE)
  const [marksSubject, setMarksSubject] = useState("");
  const [attendanceSubject, setAttendanceSubject] = useState("");

  const [internalMarks, setInternalMarks] = useState("");
  const [examDate, setExamDate] = useState("");

  const [attended, setAttended] = useState("");
  const [total, setTotal] = useState("");

  const [editingMarks, setEditingMarks] = useState(null);
  const [editingAttendance, setEditingAttendance] = useState(null);

  const [overallAttendance, setOverallAttendance] = useState(0);

  // 🔥 LOAD STUDENTS
  useEffect(() => {
    API.get("/students/students-only")
      .then(res => setStudents(res.data))
      .catch(() => toast.error("Error loading students ❌"));
  }, []);

  // 🔍 FETCH DATA
  const fetchStudentData = async (id) => {
    try {
      const marksRes = await API.get(`/marks/student/${id}`);
      const attendanceRes = await API.get(`/attendance/student/${id}`);

      setMarks(marksRes.data);
      setAttendance(attendanceRes.data);

      let totalAttended = 0;
      let totalClasses = 0;

      attendanceRes.data.forEach(a => {
        totalAttended += a.attendedClasses;
        totalClasses += a.totalClasses;
      });

      let overall =
        totalClasses === 0 ? 0 : (totalAttended / totalClasses) * 100;

      if (overall > 100) overall = 100;

      setOverallAttendance(overall);

    } catch {
      toast.error("No data found ❌");
    }
  };

  // ➕ MARKS
  const handleMarks = async () => {
    if (!studentId) return toast.error("Select student ❌");

    try {
      if (editingMarks) {
        await API.put(`/marks/update/${editingMarks.id}`, {
          subjectName: marksSubject,
          internalMarks,
          examDate
        });
        toast.success("Marks Updated ✅");
      } else {
        await API.post("/marks/add", {
          studentId,
          subjectName: marksSubject,
          internalMarks,
          examDate
        });
        toast.success("Marks Added ✅");
      }

      fetchStudentData(studentId);

      // RESET
      setMarksSubject("");
      setInternalMarks("");
      setExamDate("");
      setEditingMarks(null);

    } catch {
      toast.error("Error saving marks ❌");
    }
  };

  // ➕ ATTENDANCE
  const handleAttendance = async () => {
    if (!studentId) return toast.error("Select student ❌");

    if (Number(attended) > Number(total)) {
      return toast.error("Invalid attendance ❌");
    }

    try {
      if (editingAttendance) {
        await API.put(`/attendance/update/${editingAttendance.id}`, {
          subject: attendanceSubject,
          attendedClasses: attended,
          totalClasses: total
        });
        toast.success("Attendance Updated ✅");
      } else {
        await API.post("/attendance/add", {
          studentId,
          subject: attendanceSubject,
          attendedClasses: attended,
          totalClasses: total
        });
        toast.success("Attendance Added ✅");
      }

      fetchStudentData(studentId);

      // RESET
      setAttendanceSubject("");
      setAttended("");
      setTotal("");
      setEditingAttendance(null);

    } catch {
      toast.error("Error saving attendance ❌");
    }
  };

  // 🗑 DELETE MARKS
const deleteMarks = (record) => {
  Modal.confirm({
    title: "Delete Marks?",
    content: "This action cannot be undone ❌",
    onOk: async () => {
      try {
        await API.delete(`/marks/delete/${record.id}`);
        toast.success("Deleted successfully ✅");
        fetchStudentData(studentId);
      } catch {
        toast.error("Delete failed ❌");
      }
    }
  });
};

// 🗑 DELETE ATTENDANCE
const deleteAttendance = (record) => {
  Modal.confirm({
    title: "Delete Attendance?",
    content: "This action cannot be undone ❌",
    onOk: async () => {
      try {
        await API.delete(`/attendance/delete/${record.id}`);
        toast.success("Deleted successfully ✅");
        fetchStudentData(studentId);
      } catch {
        toast.error("Delete failed ❌");
      }
    }
  });
};

  // 📚 MARKS TABLE
  const marksColumns = [
  { title: "Subject", dataIndex: "subjectName" },
  { title: "Marks", dataIndex: "internalMarks" },
  { title: "Date", dataIndex: "examDate" },
  {
    title: "Actions",
    render: (_, record) => (
      <Space>
        <Button
          onClick={() => {
            setEditingMarks(record);
            setMarksSubject(record.subjectName);
            setInternalMarks(record.internalMarks);
            setExamDate(record.examDate);
          }}
        >
          Edit
        </Button>

        <Button danger onClick={() => deleteMarks(record)}>
          Delete
        </Button>
      </Space>
    )
  }
];

  // 📊 ATTENDANCE TABLE
  const attendanceColumns = [
  { title: "Subject", dataIndex: "subject" },
  { title: "Attended", dataIndex: "attendedClasses" },
  { title: "Total", dataIndex: "totalClasses" },
  {
    title: "%",
    render: (_, record) => {
      let percent =
        record.totalClasses === 0
          ? 0
          : (record.attendedClasses / record.totalClasses) * 100;

      return <Progress percent={Number(percent.toFixed(0))} />;
    }
  },
  {
    title: "Status",
    render: (_, record) => {
      let percent =
        record.totalClasses === 0
          ? 0
          : (record.attendedClasses / record.totalClasses) * 100;

      return (
        <Tag color={percent >= 75 ? "green" : "red"}>
          {percent >= 75 ? "Eligible" : "Low"}
        </Tag>
      );
    }
  },
  {
    title: "Actions",
    render: (_, record) => (
      <Space>
        <Button
          onClick={() => {
            setEditingAttendance(record);
            setAttendanceSubject(record.subject);
            setAttended(record.attendedClasses);
            setTotal(record.totalClasses);
          }}
        >
          Edit
        </Button>

        <Button danger onClick={() => deleteAttendance(record)}>
          Delete
        </Button>
      </Space>
    )
  }
];

  return (
    <div style={{ padding: "30px" }}>

      {/* 🔥 HEADER */}
      <Title
        level={2}
        style={{
          fontWeight: 800,
          fontSize: "32px",
          background: "linear-gradient(90deg, #22c55e, #06b6d4, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        👨‍🏫 Faculty Dashboard
      </Title>

      <p style={{ color: "#aaa", marginBottom: "25px" }}>
        Manage students, marks & attendance 🚀
      </p>

      {/* 🔥 KPI CARDS */}
      <Row gutter={20} style={{ marginBottom: "25px" }}>
        <Col span={8}>
          <Card hoverable>
            <UserOutlined />
            <h3>Students</h3>
            <h2>{students.length}</h2>
          </Card>
        </Col>

        <Col span={8}>
          <Card hoverable>
            <BookOutlined />
            <h3>Subjects</h3>
            <h2>{marks.length}</h2>
          </Card>
        </Col>

        <Col span={8}>
          <Card hoverable>
            <BarChartOutlined />
            <h3>Avg Attendance</h3>
            <h2>{overallAttendance.toFixed(1)}%</h2>
          </Card>
        </Col>
      </Row>

      {/* 🎓 SELECT */}
      <Card title="🎓 Select Student" style={{ marginBottom: "20px" }}>
        <Select
          style={{ width: 350 }}
          placeholder="Select student"
          showSearch
          onChange={(value) => {
            setStudentId(value);
            fetchStudentData(value);
          }}
        >
          {students.map(s => (
            <Option key={s.id} value={s.id}>
              {s.name} ({s.rollNo})
            </Option>
          ))}
        </Select>
      </Card>

      {/* 📚 MARKS */}
      <Card title="📚 Marks Management" style={{ marginBottom: "20px" }}>
        <Space wrap>
          <Input placeholder="Subject" value={marksSubject} onChange={(e) => setMarksSubject(e.target.value)} />
          <Input placeholder="Marks" value={internalMarks} onChange={(e) => setInternalMarks(e.target.value)} />
          <Input placeholder="Exam Date (YYYY-MM-DD)" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
          <Button type="primary" onClick={handleMarks}>
            {editingMarks ? "Update" : "Add"}
          </Button>
        </Space>

        <br /><br />

        <Table columns={marksColumns} dataSource={marks} rowKey="id" />
      </Card>

      {/* 📊 ATTENDANCE */}
      <Card title="📊 Attendance Management">
        <Space wrap>
          <Input placeholder="Subject" value={attendanceSubject} onChange={(e) => setAttendanceSubject(e.target.value)} />
          <Input placeholder="Attended" value={attended} onChange={(e) => setAttended(e.target.value)} />
          <Input placeholder="Total" value={total} onChange={(e) => setTotal(e.target.value)} />
          <Button type="primary" onClick={handleAttendance}>
            {editingAttendance ? "Update" : "Add"}
          </Button>
        </Space>

        <br /><br />

        <Table columns={attendanceColumns} dataSource={attendance} rowKey="id" />
      </Card>

      {/* 🔥 ANALYTICS */}
      {studentId && (
        <FacultyAnalytics
          marks={marks}
          attendance={attendance}
        />
      )}

    </div>
  );
}

export default FacultyPanel;