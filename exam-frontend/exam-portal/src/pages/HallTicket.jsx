import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Tag,
  Button,
  Avatar
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { QRCodeCanvas } from "qrcode.react";
import html2pdf from "html2pdf.js";
import API from "../services/api";

const { Title, Text } = Typography;

function HallTicket() {

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const storedStudent = JSON.parse(localStorage.getItem("student"));
  const studentId = storedStudent?.id;

  useEffect(() => {
    const fetchHallTicket = async () => {
      try {
        const res = await API.get(`/students/hallticket-data/${studentId}`);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching hallticket", error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchHallTicket();
  }, [studentId]);

  const subjects = data?.subjects || [];

  const downloadPDF = () => {
    const element = document.getElementById("hallticket");
    html2pdf().from(element).save("hallticket.pdf");
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading Hall Ticket...</h2>;
  }

  return (
    <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>

      <div>

        <div style={{ textAlign: "right", marginBottom: "10px" }}>
          <Button icon={<DownloadOutlined />} onClick={downloadPDF}>
            Download PDF
          </Button>
        </div>

        <div id="hallticket">
          <Card
            style={{
              width: "750px",
              borderRadius: "20px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              overflow: "hidden"
            }}
          >

            {/* HEADER */}
            <div
              style={{
                background: "linear-gradient(90deg, #1e3a8a, #06b6d4)",
                padding: "20px",
                textAlign: "center",
                color: "white"
              }}
            >
              <Avatar size={70}>
                {data?.name ? data.name.charAt(0) : "S"}
              </Avatar>

              <Title level={2} style={{ color: "white", marginTop: "10px" }}>
                🎓 ANURAG UNIVERSITY
              </Title>

              <Text style={{ color: "#e0f2fe" }}>
                Examination Hall Ticket
              </Text>
            </div>

            <Divider />

            {/* STUDENT DETAILS */}
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Name:</Text><br />
                <Text>{data?.name || "N/A"}</Text>
              </Col>

              <Col span={12}>
                <Text strong>Roll No:</Text><br />
                <Tag color="blue">{data?.rollNo || "N/A"}</Tag>
              </Col>

              <Col span={12}>
                <Text strong>Department:</Text><br />
                <Text>{data?.department || "N/A"}</Text>
              </Col>

              <Col span={12}>
                <Text strong>Semester:</Text><br />
                <Tag color="green">{data?.semester || "N/A"}</Tag>
              </Col>
            </Row>

            <Divider />

            {/* SUBJECTS */}
            <Title level={4}>📚 Subjects</Title>

            {subjects.length === 0 ? (
              <Text type="secondary">No subjects available</Text>
            ) : (
              subjects.map((sub, index) => (
                <Card
                  key={index}
                  style={{
                    marginBottom: "10px",
                    borderRadius: "10px",
                    background: "#f9fafb"
                  }}
                >
                  <Row justify="space-between">
                    <Text>{sub?.name}</Text>
                    <Tag color="purple">{sub?.date}</Tag>
                  </Row>
                </Card>
              ))
            )}

            <Divider />

            {/* QR + STATUS */}
            <Row justify="space-between" align="middle">
              <QRCodeCanvas value={data?.rollNo || "NO-DATA"} size={80} />

              <div style={{ textAlign: "right" }}>
                <Tag color="green">Eligible ✅</Tag>
                <br />
                <Text type="secondary">
                  Controller Signature
                </Text>
              </div>
            </Row>

            <Divider />

            {/* STAMP */}
            <div
              style={{
                marginTop: "20px",
                padding: "10px",
                textAlign: "center",
                border: "2px dashed #22c55e",
                borderRadius: "10px",
                color: "#22c55e",
                fontWeight: "bold"
              }}
            >
              VERIFIED ✓
            </div>

          </Card>
        </div>
      </div>
    </div>
  );
}

export default HallTicket;