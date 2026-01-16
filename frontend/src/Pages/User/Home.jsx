import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Home/Header";
import Team from "../../components/Home/Team";
import Voices from "../../components/Home/Voices";
import Footer from "../../components/Home/Footer";
import StatsSection from "../../components/Home/StatsSection";
import Feature from "../../components/Home/Feature";
import ConsistentSessionModal from "../../components/Student/ConsistentSessionModal";

function Home() {
  const [showConsistentModal, setShowConsistentModal] = useState(false);
  const [consistentData, setConsistentData] = useState(null);
  const navigate = useNavigate();

  const pageVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  useEffect(() => {
    // Check if user is logged in and is a student
    const storedUser = localStorage.getItem("user");
    // console.log("Stored user:", storedUser);
    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser);
      // console.log("Parsed user:", user);
      if (user.role !== "student") return;

      // Ensure we only show once per login session
      if (sessionStorage.getItem("consistent_popup_shown")) {
        console.log("Popup already shown for this session.");
        return;
      }

      const checkConsistentSession = async () => {
        try {
          console.log("Fetching consistent session data...");
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/session/student/${
              user.userId
            }/consistent-session`
          );

          console.log("Consistent session response:", res.data);

          if (res.data.success && res.data.consistent) {
            console.log("Showing consistent session modal.");
            setConsistentData(res.data.data);
            setShowConsistentModal(true);
            sessionStorage.setItem("consistent_popup_shown", "true");
          }
        } catch (err) {
          console.error("Failed to check consistent sessions", err);
        }
      };

      checkConsistentSession();
    } catch (e) {
      console.error("Error parsing user from localstorage", e);
    }
  }, []);

  const handleRequestSession = () => {
    if (consistentData) {
      setShowConsistentModal(false);
      navigate(`/tutor-profile/${consistentData.tutorId}`, {
        state: {
          tutorSubjectId: consistentData.tutorSubjectId,
          openRequestModal: true,
        },
      });
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <Header />
      <Feature />
      <Team />
      <Voices />
      <StatsSection />
      <Footer />

      {/* Consistent Session Popup */}
      <ConsistentSessionModal
        visible={showConsistentModal}
        data={consistentData}
        onClose={() => setShowConsistentModal(false)}
        onRequest={handleRequestSession}
      />
    </motion.div>
  );
}

export default Home;
