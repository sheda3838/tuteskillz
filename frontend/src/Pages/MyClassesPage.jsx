import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SessionCard from "../components/MyClasses/SessionCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Home/Footer";
import Header from "../components/Home/header";

// Toasts
import { notifySuccess, notifyError } from "../utils/toast";

const MyClassesPage = ({ role, userId }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const endpoint =
        role === "tutor"
          ? `/api/session/tutor/${userId}/sessions`
          : `/api/session/student/${userId}/sessions`;

      const res = await axios.get(endpoint);
      setSessions(res.data?.data || []);
    } catch (err) {
      notifyError("Failed to load sessions");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId, status, tutorNote = null) => {
    try {
      await axios.put(`/api/session/${sessionId}/status`, {
        status,
        tutorNote,
      });

      notifySuccess(`Session ${status.toLowerCase()}!`);
      fetchSessions();
    } catch (err) {
      notifyError(`Failed to ${status.toLowerCase()} session`);
    }
  };

  const handleAccept = (sessionId, tutorNote) => {
    updateSessionStatus(sessionId, "Accepted", tutorNote);
  };

  const handleReject = (sessionId, tutorNote = null) => {
    updateSessionStatus(sessionId, "Declined", tutorNote);
  };

  const handleView = (sessionId) => {
    navigate(`/session/${sessionId}`);
  };

  return (
    <div>
      <Header />

      {/* Page Fade-in Animation */}
      <motion.div
        className="my-classes-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {loading ? (
          <p>Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="no-sessions"
          >
            No sessions available.
          </motion.p>
        ) : (
          <div className="my-classes-grid">
            <AnimatePresence>
              {sessions.map((s, index) => (
                <motion.div
                  key={s.sessionId}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05, // stagger animation
                  }}
                >
                  <SessionCard
                    key={s.sessionId}
                    sessionData={s}
                    role={role}
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
