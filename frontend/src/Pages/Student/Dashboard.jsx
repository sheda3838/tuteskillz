import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Student/Dashboard.css";
import Loading from "../../utils/Loading";
import { notifyError } from "../../utils/toast";
import Header from "../../components/Home/Header";
import {
  FaChalkboardTeacher,
  FaStar,
  FaBook,
  FaUserGraduate,
} from "react-icons/fa";

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/signin");
        return;
      }

      try {
        const user = JSON.parse(storedUser);
        if (user.role !== "student") {
          navigate("/");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/student/dashboard/${user.userId}`,
        );

        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        notifyError(
          err.response?.data?.message || "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) return <Loading />;
  if (!data)
    return <div className="text-center p-10">Failed to load data.</div>;

  const { overall, subjects, recommendations } = data;

  return (
    <>
      <Header
        title={
          <h1>
            Your <span>Learning</span> Dashboard
          </h1>
        }
        subtitle={
          <p>
            Track your progress, manage sessions, and find top tutors to boost
            your skills.
          </p>
        }
      />

      <div className="student-dashboard">
        {/* 1. Overall Stats */}
        <div className="stats-grid">
          <div className="stat-card gradient-blue">
            <div className="icon-box">
              <FaUserGraduate />
            </div>
            <div className="stat-text">
              <span className="stat-value">{overall.totalSessions}</span>
              <span className="stat-label">Sessions Completed</span>
            </div>
          </div>

          <div className="stat-card gradient-green">
            <div className="icon-box">
              <FaStar />
            </div>
            <div className="stat-text">
              <span className="stat-value">
                {Number(overall.avgRating).toFixed(1)}{" "}
                <span className="sub-text">/ 5.0</span>
              </span>
              <span className="stat-label">Avg Learning Rating</span>
            </div>
          </div>

          <div className="stat-card gradient-purple">
            <div className="icon-box">
              <FaBook />
            </div>
            <div className="stat-text">
              <span className="stat-value">{subjects.length}</span>
              <span className="stat-label">Subjects Learned</span>
            </div>
          </div>
        </div>

        <div className="viz-grid">
          {/* 2. Learning Performance (Subject-wise) */}
          <div className="dashboard-section card-box">
            <div className="flex items-center gap-2 mb-4">
              <FaBook size={20} className="text-gray-600" />
              <h2 className="section-title mb-0">Learning Performance</h2>
            </div>
            {subjects.length === 0 ? (
              <p className="no-data">No completed sessions yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="subject-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th className="text-center">Sessions</th>
                      <th className="text-right">Avg Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((sub, idx) => (
                      <tr key={idx}>
                        <td>{sub.subjectName}</td>
                        <td className="text-center">{sub.totalSessions}</td>
                        <td className="text-right">
                          <span
                            className={`rating-badge ${
                              Number(sub.avgRating) >= 4.5
                                ? "good"
                                : Number(sub.avgRating) >= 3
                                  ? "avg"
                                  : "low"
                            }`}
                          >
                            {Number(sub.avgRating).toFixed(1)} ★
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="viz-grid-2">
          {/* 4. Recommended Tutors */}
          <div className="dashboard-section card-box">
            <div className="flex items-center gap-2 mb-4">
              <FaChalkboardTeacher size={20} className="text-gray-600" />
              <h2 className="section-title mb-0">Recommended Tutors</h2>
            </div>
            {recommendations.length === 0 ? (
              <p className="no-data">
                No recommendations yet. Complete a session to see top tutors!
              </p>
            ) : (
              <div className="rec-list">
                {recommendations.map((rec) => (
                  <div key={rec.userId} className="rec-item">
                    <img
                      src={
                        rec.profilePhoto
                          ? `data:image/jpeg;base64,${rec.profilePhoto}`
                          : "https://via.placeholder.com/50"
                      }
                      alt={rec.fullName}
                      className="rec-avatar"
                    />
                    <div className="rec-info">
                      <h4>{rec.fullName}</h4>
                      <p>{rec.subjectName}</p>
                    </div>
                    <div className="rec-rating">
                      ⭐ {Number(rec.rating).toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
