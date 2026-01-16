import React from "react";
import "../../styles/TutorProfile/ActionButtons.css";

const ActionButtons = ({
  role,
  onRequestSession,
  onProfile,
  onDeleteProfile,
  onAvailability,
  onBankDetails,
  onSubjects, // 🔥 NEW PROP
  onSuspend,
}) => {
  return (
    <div className=" action-buttons-admin">
      <h3>Actions</h3>

      <div className="action-button-group">
        {role === "student" && (
          <button className="action-btn primary" onClick={onRequestSession}>
            Request Session
          </button>
        )}

        {role === "tutor" && (
          <>
            <button className="action-btn" onClick={onProfile}>
              Update Profile
            </button>

            {/* 🔥 NEW BUTTON */}
            <button className="action-btn" onClick={onSubjects}>
              Teaching Subjects
            </button>

            <button className="action-btn" onClick={onAvailability}>
              Availability
            </button>

            <button className="action-btn" onClick={onBankDetails}>
              Bank Details
            </button>

            <button className="action-btn danger" onClick={onDeleteProfile}>
              Delete Profile
            </button>
          </>
        )}

        {role === "admin" && (
          <>
            {/* 🔥 NEW BUTTON */}
            <button className="action-btn" onClick={onSubjects}>
              Teaching Subjects
            </button>

            <button className="action-btn" onClick={onAvailability}>
              Availability
            </button>

            <button className="action-btn" onClick={onBankDetails}>
              Bank Details
            </button>

            <button className="action-btn danger" onClick={onSuspend}>
              Suspend Tutor
            </button>

            <button className="action-btn danger" onClick={onDeleteProfile}>
              Delete Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
