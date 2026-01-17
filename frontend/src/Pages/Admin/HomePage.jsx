import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGraduationCap,
  FaUserGraduate,
  FaBookOpen,
  FaClipboardList,
  FaUserShield,
  FaPlus,
  FaStar,
  FaTrophy,
} from "react-icons/fa";
import axios from "axios";
import "../../styles/Admin/admin.css";

function HomePage() {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    tutorCount: 0,
    studentCount: 0,
    sessionCount: 0,
    notesCount: 0,
    adminCount: 0,
  });

  const [reports, setReports] = useState({
    bestTutors: [],
    topRevenueTutors: [],
    topSubjects: [],
    activeStudents: [],
    adminWorkload: [],
  });

  const [sortOptions, setSortOptions] = useState({
    bestTutors: "desc",
    topRevenueTutors: "desc",
    activeStudents: "desc",
    topSubjects: "desc",
  });

  const handleSortChange = (section, order) => {
    setSortOptions((prev) => ({ ...prev, [section]: order }));
  };

  const getSortedData = (data, key, order) => {
    if (!data) return [];
    const sorted = [...data];
    return sorted.sort((a, b) => {
      const valA = Number(a[key]) || 0;
      const valB = Number(b[key]) || 0;
      return order === "desc" ? valB - valA : valA - valB;
    });
  };

  // Helper to convert Buffer to Base64
  const bufferToBase64 = (buffer) => {
    if (!buffer || !buffer.data) return "https://via.placeholder.com/40";
    try {
      const binary = String.fromCharCode(...new Uint8Array(buffer.data));
      return `data:image/jpeg;base64,${window.btoa(binary)}`;
    } catch (e) {
      return "https://via.placeholder.com/40";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          countsRes,
          bestTutorsRes,
          revTutorsRes,
          subjectsRes,
          studentsRes,
          workloadRes,
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/counts`),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/admin/reports/best-tutors`,
          ),
          axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/admin/reports/top-revenue-tutors`,
          ),
          axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/admin/reports/top-subject-revenue`,
          ),
          axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/admin/reports/most-active-students`,
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/admin/reports/admin-workload`,
          ),
        ]);

        if (countsRes.data.success) {
          setCounts(
            countsRes.data.counts || {
              tutorCount: 0,
              studentCount: 0,
              sessionCount: 0,
              notesCount: 0,
              adminCount: 0,
            },
          );
        }

        setReports({
          bestTutors:
            bestTutorsRes.data.success && Array.isArray(bestTutorsRes.data.data)
              ? bestTutorsRes.data.data
              : [],
          topRevenueTutors:
            revTutorsRes.data.success && Array.isArray(revTutorsRes.data.data)
              ? revTutorsRes.data.data
              : [],
          topSubjects:
            subjectsRes.data.success && Array.isArray(subjectsRes.data.data)
              ? subjectsRes.data.data
              : [],
          activeStudents:
            studentsRes.data.success && Array.isArray(studentsRes.data.data)
              ? studentsRes.data.data
              : [],
          adminWorkload:
            workloadRes.data.success && Array.isArray(workloadRes.data.data)
              ? workloadRes.data.data
              : [],
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
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
        <h1>Welcome Admin</h1>
        <p>Overview of platform performance and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid-admin">
        {statData.map((item, index) => (
          <div
            key={index}
            className={`stat-card ${item.className}`}
            onClick={() => navigate(item.path)}
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

      {/* REPORTS GRID */}
      <div className="reports-grid">
        {/* 1. BEST TUTORS */}
        <div className="report-card">
          <div className="report-card-header">
            <h3>🏆 Top Performing Tutors</h3>
            <select
              className="sort-select"
              value={sortOptions.bestTutors}
              onChange={(e) => handleSortChange("bestTutors", e.target.value)}
            >
              <option value="desc">Highest to Lowest</option>
              <option value="asc">Lowest to Highest</option>
            </select>
          </div>
          {reports.bestTutors.length === 0 ? (
            <p className="no-data">No data available</p>
          ) : (
            getSortedData(
              reports.bestTutors,
              "averageRating",
              sortOptions.bestTutors,
            ).map((tutor, idx) => (
              <div className="list-item" key={tutor.userId}>
                <div className="list-info">
                  <span
                    style={{ fontWeight: "bold", color: "#ccc", width: "15px" }}
                  >
                    #{idx + 1}
                  </span>
                  <img
                    src={bufferToBase64(tutor.profilePhoto)}
                    alt={tutor.fullName}
                    className="list-img"
                  />
                  <div className="list-text">
                    <h4>{tutor.fullName}</h4>
                    <p>
                      {tutor.completedSessions} sessions •{" "}
                      {Number(tutor.averageRating).toFixed(1)}{" "}
                      <FaStar color="#f1c40f" size={10} />
                    </p>
                  </div>
                </div>
                <div className="rank-badge">
                  <FaTrophy size={10} />{" "}
                  {Number(tutor.rankScore || 0).toFixed(0)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2. TOP REVENUE TUTORS */}
        <div className="report-card">
          <div className="report-card-header">
            <h3>💰 Top Revenue Tutors (30 Days)</h3>
            <select
              className="sort-select"
              value={sortOptions.topRevenueTutors}
              onChange={(e) =>
                handleSortChange("topRevenueTutors", e.target.value)
              }
            >
              <option value="desc">Highest to Lowest</option>
              <option value="asc">Lowest to Highest</option>
            </select>
          </div>
          {reports.topRevenueTutors.length === 0 ? (
            <p className="no-data">No revenue yet</p>
          ) : (
            getSortedData(
              reports.topRevenueTutors,
              "totalRevenue",
              sortOptions.topRevenueTutors,
            ).map((tutor) => (
              <div className="list-item" key={tutor.userId}>
                <div className="list-info">
                  <img
                    src={bufferToBase64(tutor.profilePhoto)}
                    alt={tutor.fullName}
                    className="list-img"
                  />
                  <div className="list-text">
                    <h4>{tutor.fullName}</h4>
                    <p>Revenue Generated</p>
                  </div>
                </div>
                <span className="revenue-badge">
                  LKR {Number(tutor.totalRevenue || 0).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* 3. MOST ACTIVE STUDENTS */}
        <div className="report-card">
          <div className="report-card-header">
            <h3>🎓 Most Active Students</h3>
            <select
              className="sort-select"
              value={sortOptions.activeStudents}
              onChange={(e) =>
                handleSortChange("activeStudents", e.target.value)
              }
            >
              <option value="desc">Most Sessions</option>
              <option value="asc">Least Sessions</option>
            </select>
          </div>
          {reports.activeStudents.length === 0 ? (
            <p className="no-data">No active students</p>
          ) : (
            getSortedData(
              reports.activeStudents,
              "sessionsJoined",
              sortOptions.activeStudents,
            ).map((student) => (
              <div className="list-item" key={student.userId}>
                <div className="list-info">
                  <img
                    src={bufferToBase64(student.profilePhoto)}
                    alt={student.fullName}
                    className="list-img"
                  />
                  <div className="list-text">
                    <h4>{student.fullName}</h4>
                    <p>{student.sessionsJoined || 0} sessions joined</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 4. SUBJECT REVENUE */}
        <div className="report-card">
          <div className="report-card-header">
            <h3>📚 Top Subjects by Revenue</h3>
            <select
              className="sort-select"
              value={sortOptions.topSubjects}
              onChange={(e) => handleSortChange("topSubjects", e.target.value)}
            >
              <option value="desc">Highest to Lowest</option>
              <option value="asc">Lowest to Highest</option>
            </select>
          </div>
          {reports.topSubjects.length === 0 ? (
            <p className="no-data">No data available</p>
          ) : (
            getSortedData(
              reports.topSubjects,
              "totalRevenue",
              sortOptions.topSubjects,
            ).map((sub, idx) => {
              // Calc max for bar width
              const maxRev = Math.max(
                ...reports.topSubjects.map((s) => Number(s.totalRevenue)),
              );
              const width = (Number(sub.totalRevenue) / maxRev) * 100;

              return (
                <div className="bar-item" key={idx}>
                  <div className="bar-header">
                    <span>{sub.subjectName}</span>
                    <span>
                      LKR {Number(sub.totalRevenue || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="bar-bg">
                    <div
                      className="bar-fill"
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 5. ADMIN WORKLOAD */}
        <div className="report-card">
          <h3>🛡️ Admin Workload</h3>
          {reports.adminWorkload.length === 0 ? (
            <p className="no-data">No data available</p>
          ) : (
            reports.adminWorkload.map((admin) => (
              <div className="list-item" key={admin.userId}>
                <div className="list-info">
                  <img
                    src={bufferToBase64(admin.profilePhoto)}
                    alt={admin.fullName}
                    className="list-img"
                  />
                  <div className="list-text">
                    <h4>{admin.fullName}</h4>
                    <p>
                      {admin.verificationsHandled || 0} verifications handled
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
