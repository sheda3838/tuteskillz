// src/pages/admin/HomePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGraduationCap,
  FaUserGraduate,
  FaBookOpen,
  FaClipboardList,
  FaUserShield,
  FaPlus,
} from "react-icons/fa";
import axios from "axios";
import "../../styles/Admin/admin.css";

function HomePage() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    tutors: 0,
    students: 0,
    sessions: 0,
    notes: 0,
    admins: 0,
  });

  useEffect(() => {
    axios
      .get("/api/admin/counts")
      .then((res) => {
        if (res.data.success) {
          setCounts(res.data.counts);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const statData = [
    {
      title: "Tutors",
      stat: counts.tutorCount || "0",
      icon: FaGraduationCap,
      className: "tutors",
      path: "/admin/tutors",
    },
    {
      title: "Students",
      stat: counts.studentCount || "0",
      icon: FaUserGraduate,
      className: "students",
      path: "/admin/students",
    },
    {
      title: "Sessions",
      stat: counts.sessionCount || "0",
      icon: FaBookOpen,
      className: "sessions",
      path: "/admin/sessions",
    },
    {
      title: "Notes",
      stat: counts.notesCount || "0",
      icon: FaClipboardList,
      className: "notes",
      path: "/admin/notes",
    },
    {
      title: "Admins",
      stat: counts.adminCount || "0",
      icon: FaUserShield,
      className: "admins",
      path: "/admin/admins",
    },
  ];

  return (
    <div className="dashboard-home">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>Welcome Zaid</h1>
        <p>Manage Your Platform With Ease</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid-admin">
        {statData.map((item, index) => (
          <div
            key={index}
            className={`stat-card ${item.className}`}
            onClick={() => navigate(item.path)}
            style={{ cursor: "pointer" }}
          >
            <div className="card-icon-wrapper">
              <item.icon />
            </div>
            <p className="card-title">{item.title}</p>
            <h2 className="card-stat">
              {item.stat}{" "}
              <FaPlus style={{ marginLeft: "4px", fontSize: "0.8em" }} />
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
