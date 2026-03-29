import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Layout as AntLayout,
  Dropdown,
  Avatar,
  Button,
  Menu
} from "antd";

import {
  UserOutlined,
  LogoutOutlined,
  BarChartOutlined,
  BookOutlined,
  FileTextOutlined,
  DashboardOutlined
} from "@ant-design/icons";

const { Header, Content, Sider } = AntLayout;

export default function Layout() {
  const location = useLocation();
  const [dark, setDark] = useState(true);

  // ✅ SAFE USER (NO CRASH)
  const user = JSON.parse(localStorage.getItem("student") || "{}");

  const menu = [
    { path: "/dashboard", name: "Dashboard", icon: <DashboardOutlined /> },
    { path: "/attendance", name: "Attendance", icon: <BarChartOutlined /> },
    { path: "/marks", name: "Marks", icon: <BookOutlined /> },
    { path: "/hallticket", name: "Hall Ticket", icon: <FileTextOutlined /> }
  ];

  // ✅ DROPDOWN ITEMS
  const dropdownItems = [
    {
      key: "1",
      label: (
        <div>
          <b>{user?.name || "User"}</b><br />
          <span style={{ fontSize: "12px", color: "#888" }}>
            {user?.role || "STUDENT"}
          </span>
        </div>
      )
    },
    {
      key: "2",
      label: (
        <span onClick={() => setDark(!dark)}>
          {dark ? "🌙 Dark Mode" : "☀ Light Mode"}
        </span>
      )
    },
    {
      key: "3",
      danger: true,
      icon: <LogoutOutlined />,
      label: (
        <span
          onClick={() => {
            if (window.confirm("Logout?")) {
              localStorage.removeItem("student");
              window.location.href = "/";
            }
          }}
        >
          Logout
        </span>
      )
    }
  ];

  return (
    <AntLayout style={{ minHeight: "100vh" }}>

      {/* 🔥 SIDEBAR */}
      <Sider
        theme={dark ? "dark" : "light"}
        width={220}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >

        {/* TOP */}
        <div>
          <div
            style={{
              color: dark ? "white" : "black",
              padding: "20px",
              fontWeight: "bold",
              fontSize: "18px"
            }}
          >
            🎓 Portal
          </div>

          {menu.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 20px",
                textDecoration: "none",
                color:
                  location.pathname === item.path
                    ? "#22c55e"
                    : dark ? "#aaa" : "#333",
                background:
                  location.pathname === item.path
                    ? "rgba(34,197,94,0.1)"
                    : "transparent"
              }}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </div>

        {/* 🔻 BOTTOM BUTTONS */}
        <div style={{ padding: "15px" }}>

          <Button
            block
            style={{ marginBottom: "10px" }}
            onClick={() => setDark(!dark)}
          >
            {dark ? "🌙 Dark Mode" : "☀ Light Mode"}
          </Button>

          <Button
            danger
            block
            onClick={() => {
              localStorage.removeItem("student");
              window.location.href = "/";
            }}
          >
            🚪 Logout
          </Button>

        </div>
      </Sider>

      {/* 🔥 MAIN */}
      <AntLayout>

        {/* 🔝 NAVBAR */}
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: dark ? "#1f1f1f" : "#fff",
            padding: "0 20px"
          }}
        >
          <h3 style={{ color: dark ? "white" : "black", margin: 0 }}>
            Dashboard
          </h3>

          {/* ✅ FIXED DROPDOWN (WORKS IN ALL ANTD VERSIONS) */}
          <Dropdown
            overlay={<Menu items={dropdownItems} />}
            placement="bottomRight"
          >
            <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
          </Dropdown>
        </Header>

        {/* 📦 CONTENT */}
        <Content style={{ padding: "20px" }}>
          <Outlet />
        </Content>

      </AntLayout>

    </AntLayout>
  );
}