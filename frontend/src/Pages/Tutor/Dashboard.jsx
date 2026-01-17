import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Tutor/Dashboard.css";
import Loading from "../../utils/Loading";
import { notifyError } from "../../utils/toast";
import {
  FaChalkboardTeacher,
  FaStar,
  FaHistory,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

import Header from "../../components/Home/Header";

const TutorDashboard = () => {
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
        if (user.role !== "tutor") {
          navigate("/"); // Access denied
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/tutor/dashboard/${user.userId}`,
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

  const { overall, subjects, trends, peakTimes } = data;

  // Helper for max value in charts
  const maxTrend = Math.max(...trends.map((t) => t.sessionCount), 1);

  return (
    <>
      <Header
        title={
          <h1>
            Your Personal <span>Tutor</span> Dashboard
          </h1>
        }
        subtitle={
          <p>
            Track your sessions, ratings, and teaching impact all in one place.
          </p>
        }
      />

      <div className="tutor-dashboard">
        {/* 🎯 Overall Summary (Enhanced Cards) */}
        <div className="stats-grid">
          <div className="stat-card gradient-blue">
            <div className="icon-box">
              <FaChalkboardTeacher />
            </div>
            <div className="stat-text">
              <span className="stat-value">{overall.totalSessions}</span>
              <span className="stat-label">Total Completed Sessions</span>
            </div>
          </div>

          <div className="stat-card gradient-green">
            <div className="icon-box">
              <FaStar />
            </div>
            <div className="stat-text">
              <span className="stat-value">
                {overall.avgRating} <span className="sub-text">/ 5.0</span>
              </span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>

          <div className="stat-card gradient-purple">
            <div className="icon-box">
              <FaHistory />
            </div>
            <div className="stat-text">
              <span className="stat-value">{subjects.length}</span>
              <span className="stat-label">Active Subjects</span>
            </div>
          </div>
        </div>

        <div className="viz-grid">
          {/* 📚 Subject Performance */}
          <div className="dashboard-section card-box">
            <div className="flex items-center gap-2 mb-4">
              <FaChalkboardTeacher size={20} className="text-gray-600" />
              <h2 className="section-title mb-0">Subject Performance</h2>
            </div>
            {subjects.length === 0 ? (
              <p className="no-data">No session data available yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="subject-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th className="text-center">Sessions</th>
                      <th className="text-right">Total Revenue</th>
                      <th className="text-right">Avg Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((sub, idx) => (
                      <tr key={idx}>
                        <td>{sub.subjectName}</td>
                        <td className="text-center">{sub.totalSessions}</td>
                        <td className="text-right font-medium">
                          LKR {Number(sub.totalRevenue).toLocaleString()}
                        </td>
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

          {/* 🕒 Peak Times */}
          <div className="dashboard-section card-box">
            <div className="flex items-center gap-2 mb-4">
              <FaClock size={20} className="text-gray-600" />
              <h2 className="section-title mb-0">Peak Teaching Times</h2>
            </div>
            {peakTimes.length === 0 ? (
              <p className="no-data">No data available.</p>
            ) : (
              <ul className="peak-time-list">
                {peakTimes.map((time, idx) => (
                  <li key={idx} className="peak-time-item">
                    <div className="time-info">
                      <span className="time-icon">⏰</span>
                      <span className="time-slot">{time.startTime}</span>
                    </div>
                    <span className="time-count">
                      {time.sessionCount} sessions
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 📈 Booking Trends Report (Improved UI) */}
        <div className="dashboard-section card-box full-width">
          <div className="flex items-center gap-2 mb-4">
            <FaCalendarAlt size={20} className="text-gray-600" />
            <h2 className="section-title mb-0">Weekly Booking Distribution</h2>
          </div>
          {/* Note: We handle empty states in backend now by returning 0-filled arrays, but check just in case */}
          {trends.length === 0 ? (
            <p className="no-data py-8">No booking history yet.</p>
          ) : (
            <div className="chart-wrapper pie-container">
              <div
                className="pie-chart"
                style={{
                  background: `conic-gradient(
                    #4facfe 0% ${((trends[0].sessionCount / trends.reduce((a, b) => a + b.sessionCount, 0)) * 100).toFixed(2)}%,
                    #43e97b ${((trends[0].sessionCount / trends.reduce((a, b) => a + b.sessionCount, 0)) * 100).toFixed(2)}% ${(((trends[0].sessionCount + trends[1].sessionCount) / trends.reduce((a, b) => a + b.sessionCount, 0)) * 100).toFixed(2)}%,
                    #a18cd1 ${(((trends[0].sessionCount + trends[1].sessionCount) / trends.reduce((a, b) => a + b.sessionCount, 0)) * 100).toFixed(2)}% ${(((trends[0].sessionCount + trends[1].sessionCount + trends[2].sessionCount) / trends.reduce((a, b) => a + b.sessionCount, 0)) * 100).toFixed(2)}%,
                    #fbc2eb ${(((trends[0].sessionCount + trends[1].sessionCount + trends[2].sessionCount) / trends.reduce((a, b) => a + b.sessionCount, 0)) * 100).toFixed(2)}% ${(((trends[0].sessionCount + trends[1].sessionCount + trends[2].sessionCount + trends[3].sessionCount) / trends.reduce((a, b) => a + b.sessionCount, 0)) * 100).toFixed(2)}%,
                    #f093fb ${(((trends[0].sessionCount + trends[1].sessionCount + trends[2].sessionCount + trends[3].sessionCount) / trends.reduce((a, b) => a + b.sessionCount, 0)) * 100).toFixed(2)}% ${(((trends[0].sessionCount + trends[1].sessionCount + trends[2].sessionCount + trends[3].sessionCount + trends[4].sessionCount) / trends.reduce((a, b) => a + b.sessionCount, 0)) * 100).toFixed(2)}%,
                    #81ecec ${(((trends[0].sessionCount + trends[1].sessionCount + trends[2].sessionCount + trends[3].sessionCount + trends[4].sessionCount) / trends.reduce((a, b) => a + b.sessionCount, 0)) * 100).toFixed(2)}% ${(((trends[0].sessionCount + trends[1].sessionCount + trends[2].sessionCount + trends[3].sessionCount + trends[4].sessionCount + trends[5].sessionCount) / trends.reduce((a, b) => a + b.sessionCount, 0)) * 100).toFixed(2)}%,
                    #fab1a0 ${(((trends[0].sessionCount + trends[1].sessionCount + trends[2].sessionCount + trends[3].sessionCount + trends[4].sessionCount + trends[5].sessionCount) / trends.reduce((a, b) => a + b.sessionCount, 0)) * 100).toFixed(2)}% 100%
                  )`,
                }}
              ></div>
              <div className="pie-legend">
                {trends.map((t, idx) => {
                  const colors = [
                    "#4facfe",
                    "#43e97b",
                    "#a18cd1",
                    "#fbc2eb",
                    "#f093fb",
                    "#81ecec",
                    "#fab1a0",
                  ];
                  const total = trends.reduce((a, b) => a + b.sessionCount, 0);
                  const percent =
                    total > 0 ? ((t.sessionCount / total) * 100).toFixed(1) : 0;
                  return (
                    <div key={idx} className="legend-item">
                      <span
                        className="dot"
                        style={{ backgroundColor: colors[idx] }}
                      ></span>
                      <span className="label">
                        {t.day}: {percent}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TutorDashboard;
