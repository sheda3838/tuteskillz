import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SetAvailability from "../../components/TutorProfile/SetAvailability";
import SetBankDetailsModal from "../../components/TutorProfile/SetBankDetails";
import { notifyError } from "../../utils/toast";
import { motion } from "framer-motion";
import { authGuard } from "../../utils/authGuard";
import "../../styles/Tutor/TutorHome.css"

function Home() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [existingSlots, setExistingSlots] = useState([]);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const validateTutor = async () => {
      const user = await authGuard(navigate);

      if (!user) return; // already redirected by authGuard

      if (user.role !== "tutor") {
        notifyError("Unauthorized access");
        return navigate("/", { replace: true });
      }

      setUserId(user.userId);

      try {
        const { data } = await axios.get(`/api/tutor/status/${user.userId}`);
        setStatus(data.status);

        if (data.status === "complete") {
          navigate("/", { replace: true });
        } else if (data.status === "incomplete") {
          const needA = !data.details.hasAvailability;
          const needB = !data.details.hasBankDetails;

          if (needA) setShowAvailabilityModal(true);
          else if (needB) setShowBankModal(true);
        }
      } catch (err) {
        notifyError("Error fetching tutor status");
        console.error(err);
      }

      try {
        const res = await axios.get(`/api/tutor/availability/${user.userId}`);
        if (res.data.success && Array.isArray(res.data.availability)) {
          setExistingSlots(res.data.availability);
        }
      } catch (err) {
        notifyError("Error fetching availability");
        console.error(err);
      }
    };

    validateTutor();
  }, [navigate]);

  const handleAvailabilitySaved = () => {
    setShowAvailabilityModal(false);
    setShowBankModal(true);
  };

  const handleBankSaved = () => {
    setShowBankModal(false);
    navigate("/", { replace: true });
  };

  // Framer Motion variants
  const pageVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <motion.div
      className="home-page-container-tutor"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {status === "pending_verification" && (
        <div className="tutor-status">
          <img src="/src/assets/pending.png" alt="Pending image" />
          <h2>Waiting for admin approval...</h2>
        </div>
      )}

      {status === "verification_rejected" && (
        <div className="tutor-status">
          <img src="/src/assets/rejected.png" alt="Rejected image" />
          <h2>Your verification was rejected. Please contact support.</h2>
        </div>
      )}

      {status !== "pending_verification" && status !== "verification_rejected" && (
        <div>
          {showAvailabilityModal && userId && (
            <SetAvailability
              existingSlots={existingSlots}
              tutorId={userId}
              onSaved={handleAvailabilitySaved}
              onClose={() => setShowAvailabilityModal(false)}
            />
          )}

          {showBankModal && userId && (
            <SetBankDetailsModal
              tutorId={userId}
              onSaved={handleBankSaved}
              onClose={() => setShowBankModal(false)}
            />
          )}
        </div>
      )}
    </motion.div>
  );
}

export default Home;
