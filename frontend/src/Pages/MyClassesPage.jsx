import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SessionCard from "../components/MyClasses/SessionCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Home/Footer";
import Header from "../components/Home/header";
import Loading  from "../utils/Loading";
import { authGuard } from "../utils/authGuard";

// Toasts
import { notifySuccess, notifyError } from "../utils/toast";

const MyClassesPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const validate = async () => {
      const user = await authGuard(navigate); // redirect if not logged in
      if (!user) return;
      setCurrentUser(user);
    };
    validate();
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchSessions = async () => {
      try {
        const endpoint =
          currentUser.role === "tutor"
            ? `/api/session/tutor/${currentUser.userId}/sessions`
            : `/api/session/student/${currentUser.userId}/sessions`;

        const res = await axios.get(endpoint);
        setSessions(res.data?.data || []);
      } catch (err) {
        notifyError("Failed to load sessions");
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [currentUser]);
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
          <Loading />
        ) : sessions.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="no-sessions"
          >
            <img className="no-sessions" src="/src/assets/no-sessions.png" alt="" />
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
