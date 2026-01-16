import React from "react";
import "./ConsistentSessionModal.css";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ConsistentSessionModal = ({ visible, data, onClose, onRequest }) => {
  if (!visible || !data) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="consistent-modal"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
        >
          <div className="modal-icon">
            <FaUserGraduate />
          </div>

          <h2>Keep Building Your Momentum!</h2>
          <p className="modal-subtitle">
            You've been consistently learning <strong>{data.subject}</strong>{" "}
            with <strong>{data.tutorName}</strong>.
          </p>

          <div className="streak-stats">
            <div className="stat-item">
              <FaChalkboardTeacher className="stat-icon" />
              <span>{data.tutorName}</span>
            </div>
            <div className="stat-item">
              <FaCalendarAlt className="stat-icon" />
              <span>Consistent Sessions</span>
            </div>
          </div>

          <p className="modal-text">
            Consistency is key to mastery. Would you like to schedule your next
            session now?
          </p>

          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose}>
              Maybe Later
            </button>
            <button className="btn-primary" onClick={onRequest}>
              Schedule Next Session
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConsistentSessionModal;
