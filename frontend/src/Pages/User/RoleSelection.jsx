import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/roleSelection.css";
import { motion } from "framer-motion";
import axios from "axios";

const RoleSelection = () => {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  return (
    <motion.div
      className="role-container"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div>
        <div className="role-box">
          <h1>Select Your Role</h1>
          <p className="role-subtitle">
            Choose whether you want to study or teach
          </p>
          <div className="role-cards">
            {/* Student Card */}
            <div
              className="role-card"
              onClick={() => navigate("/student-register")}
            >
              <img src="/src/assets/student.png" alt="Study" />
              <h2>Learn</h2>
              <p>Learn and grow with TuteSkillz</p>
            </div>

            {/* Tutor Card */}
            <div
              className="role-card"
              onClick={() => navigate("/tutor-register")}
            >
              <img src="/src/assets/tutor.png" alt="Teach" />
              <h2>Teach</h2>
              <p>Share your knowledge and guide students</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoleSelection;
