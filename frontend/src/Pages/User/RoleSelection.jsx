import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/User/roleSelection.css";
import { motion } from "framer-motion";
import { localAuthGuard } from "../../utils/LocalAuthGuard";
import { notifyError } from "../../utils/toast";

const RoleSelection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const validate = async () => {
      const user = localAuthGuard(navigate);

      // If null → already redirected
      if (!user) return;

      // 🟢 USER EXISTS BUT NOT NEW → Redirect them
      if (user.role === "student") return navigate("/", { replace: true });
      if (user.role === "tutor") return navigate("/tutor", { replace: true });
      if (user.role === "admin") return navigate("/admin", { replace: true });

      // ⚠️ Safety check: if somehow user has no role but not new → error
      notifyError("Invalid access. Please sign in again.");
      navigate("/signin", { replace: true });
    };

    validate();
  }, [navigate]);

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
            <div
              className="role-card"
              onClick={() =>
                navigate("/student-register", { state: { role: "student" } })
              }
            >
              <img src="/student.png" alt="Study" />
              <h2>Learn</h2>
              <p>Learn and grow with TuteSkillz</p>
            </div>

            <div
              className="role-card"
              onClick={() =>
                navigate("/tutor-register", { state: { role: "tutor" } })
              }
            >
              <img src="/tutor.png" alt="Teach" />
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
