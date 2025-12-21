import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SessionCard from "../components/MyClasses/SessionCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Home/Footer";
import Header from "../components/Home/Header";
import Loading from "../utils/Loading";
import { localAuthGuard } from "../utils/LocalAuthGuard";
import { notifySuccess, notifyError } from "../utils/toast";
import { AiOutlineClose } from "react-icons/ai"; // react-icons for clear button

const MyClassesPage = () => {
  axios.defaults.withCredentials = true;
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // Default 'All'
  const navigate = useNavigate();

  useEffect(() => {
    const validate = () => {
      const user = localAuthGuard(navigate);
      if (!user) return;
      setCurrentUser(user);
    };
    validate();
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;
    fetchSessions();
  }, [currentUser, statusFilter]); // Re-fetch when status changes

  const fetchSessions = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const endpoint =
        currentUser.role === "tutor"
          ? `${import.meta.env.VITE_BACKEND_URL}/session/tutor/${
              currentUser.userId
            }/sessions`
          : `${import.meta.env.VITE_BACKEND_URL}/session/student/${
              currentUser.userId
            }/sessions`;

      // Pass status query param if not 'All'
      const params = {};
      if (statusFilter !== "All") {
        params.status = statusFilter;
      }

      const res = await axios.get(endpoint, { params });
      setSessions(res.data?.data || []);
    } catch (err) {
      notifyError("Failed to load sessions");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (
    sessionId,
    tutorNote,
    sessionDate,
    sessionStartTime
  ) => {
    try {
      const formattedDate = new Date(sessionDate).toISOString().split("T")[0];
      const conflictRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/session/tutor/${
          currentUser.userId
        }/check-conflict`,
        { params: { date: formattedDate, startTime: sessionStartTime } }
      );
      if (conflictRes.data.conflict)
        return notifyError(conflictRes.data.message);

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/session/${sessionId}/status`,
        { status: "Accepted", tutorNote }
      );
      notifySuccess("Session accepted successfully");
      fetchSessions();
    } catch (err) {
      console.error(err);
      notifyError("Failed to accept session");
    }
  };

  const handleReject = (sessionId, tutorNote = null) => {
    return axios
      .put(`${import.meta.env.VITE_BACKEND_URL}/session/${sessionId}/status`, {
        status: "Declined",
        tutorNote,
      })
      .then(() => {
        notifySuccess("Session declined!");
        fetchSessions();
      })
      .catch(() => notifyError("Failed to decline session"));
  };

  const handleView = (sessionId) => {
    navigate(`/session/${sessionId}`);
  };

  // Filter sessions by search and date (Status is handled by backend)
  const filteredSessions = useMemo(() => {
    let filtered = [...sessions];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.studentName?.toLowerCase().includes(term) ||
          s.tutorName?.toLowerCase().includes(term) ||
          s.subjectName?.toLowerCase().includes(term) ||
          s.grade?.toString() === term
      );
    }

    // Date filter
    if (selectedDate) {
      filtered = filtered.filter(
        (s) =>
          new Date(s.date).toDateString() ===
          new Date(selectedDate).toDateString()
      );
    }

    return filtered;
  }, [sessions, searchTerm, selectedDate]);

  const statuses = [
    "All",
    "Requested",
    "Accepted",
    "Paid",
    "Completed",
    "Cancelled",
    "Declined",
  ];

  return (
    <div>
      <Header />

      <motion.div
        className="my-classes-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Filter Bar */}
        <div className="myclasses-filter-bar">
          <input
            type="text"
            placeholder="Search by student, tutor, subject, grade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="myclasses-search-bar"
          />

          <div className="myclasses-date-wrapper">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="myclasses-date-picker"
            />
            {selectedDate && (
              <button
                className="myclasses-clear-date"
                onClick={() => setSelectedDate("")}
              >
                <AiOutlineClose size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Status Tabs */}
        <div className="myclasses-tabs">
          {statuses.map((status) => (
            <button
              key={status}
              className={statusFilter === status ? "active" : ""}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Session Cards */}
        {loading ? (
          <Loading />
        ) : filteredSessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="no-sessions-container"
            style={{ textAlign: "center", marginTop: "50px" }}
          >
            <img
              className="no-sessions"
              src="/no-sessions.png"
              alt="No Sessions"
              style={{ maxWidth: "300px", opacity: 0.8 }}
            />
            <p style={{ color: "#888", marginTop: "10px" }}>
              No sessions found for this status.
            </p>
          </motion.div>
        ) : (
          <div className="my-classes-grid">
            <AnimatePresence>
              {filteredSessions.map((s, index) => (
                <motion.div
                  key={s.sessionId}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <SessionCard
                    sessionData={s}
                    role={currentUser?.role}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onView={handleView}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      <Footer />
    </div>
  );
};

export default MyClassesPage;
