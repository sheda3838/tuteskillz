import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SessionCard from "../components/MyClasses/SessionCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Home/Footer";
import Header from "../components/Home/Header";
import Loading from "../utils/Loading";
import { authGuard } from "../utils/authGuard";
import { notifySuccess, notifyError } from "../utils/toast";
import { AiOutlineClose } from "react-icons/ai"; // react-icons for clear button

const MyClassesPage = () => {
  axios.defaults.withCredentials = true;
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'today' | 'requested' | 'all'
  const navigate = useNavigate();

  useEffect(() => {
    const validate = async () => {
      const user = await authGuard(navigate);
      if (!user) return;
      setCurrentUser(user);
    };
    validate();
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;
    fetchSessions();
  }, [currentUser]);

  const fetchSessions = async () => {
    if (!currentUser) return;
    try {
      const endpoint =
        currentUser.role === "tutor"
          ? `${import.meta.env.VITE_BACKEND_URL}/session/tutor/${currentUser.userId}/sessions`
          : `${import.meta.env.VITE_BACKEND_URL}/session/student/${currentUser.userId}/sessions`;

      const res = await axios.get(endpoint);
      setSessions(res.data?.data || []);
    } catch (err) {
      notifyError("Failed to load sessions");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (sessionId, tutorNote, sessionDate, sessionStartTime) => {
    try {
      const formattedDate = new Date(sessionDate).toISOString().split("T")[0];
      const conflictRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/session/tutor/${currentUser.userId}/check-conflict`,
        { params: { date: formattedDate, startTime: sessionStartTime } }
      );
      if (conflictRes.data.conflict) return notifyError(conflictRes.data.message);

      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/session/${sessionId}/status`, { status: "Accepted", tutorNote });
      notifySuccess("Session accepted successfully");
      fetchSessions();
    } catch (err) {
      console.error(err);
      notifyError("Failed to accept session");
    }
  };

  const handleReject = (sessionId, tutorNote = null) => {
    axios.put(`${import.meta.env.VITE_BACKEND_URL}/session/${sessionId}/status`, { status: "Declined", tutorNote })
      .then(() => {
        notifySuccess("Session declined!");
        fetchSessions();
      })
      .catch(() => notifyError("Failed to decline session"));
  };

  const handleView = (sessionId) => {
    // navigate(`/session/${sessionId}`);
  };

  // Filter sessions by search, date, and tab
  const filteredSessions = useMemo(() => {
    let filtered = [...sessions];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        s =>
          s.studentName?.toLowerCase().includes(term) ||
          s.tutorName?.toLowerCase().includes(term) ||
          s.subjectName?.toLowerCase().includes(term) ||
          s.grade?.toString() === term
      );
    }

    // Date filter
    if (selectedDate) {
      filtered = filtered.filter(
        s => new Date(s.date).toDateString() === new Date(selectedDate).toDateString()
      );
    }

    // Tab filter
    const todayStr = new Date().toDateString();
    if (activeTab === "today") {
      filtered = filtered.filter(s => new Date(s.date).toDateString() === todayStr);
    } else if (activeTab === "requested") {
      filtered = filtered.filter(s => s.sessionStatus === "Requested");
    }

    return filtered;
  }, [sessions, searchTerm, selectedDate, activeTab]);

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
            onChange={e => setSearchTerm(e.target.value)}
            className="myclasses-search-bar"
          />

          <div className="myclasses-date-wrapper">
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
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

        {/* Tabs */}
        <div className="myclasses-tabs">
          <button className={activeTab === "today" ? "active" : ""} onClick={() => setActiveTab("today")}>
            Today's Sessions
          </button>
          <button className={activeTab === "requested" ? "active" : ""} onClick={() => setActiveTab("requested")}>
            Requested Sessions
          </button>
          <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>
            All
          </button>
        </div>

        {/* Session Cards */}
        {loading ? (
          <Loading />
        ) : filteredSessions.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="no-sessions">
            <img className="no-sessions" src="/no-sessions.png" alt="No Sessions" />
          </motion.p>
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
 