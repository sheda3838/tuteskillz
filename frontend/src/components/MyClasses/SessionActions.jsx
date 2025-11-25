import React, { useState } from "react";
import "../../styles/User/MyClasses.css";
import { notifyError, notifySuccess } from "../../utils/toast";

const SessionActions = ({
  role,
  sessionStatus,
  tutorNote: initialNote,
  onAccept,
  onReject,
  onView,
}) => {
  const [tutorNote, setTutorNote] = useState(initialNote || "");


  const handleAcceptClick = () => {
    if (!tutorNote.trim()) {
      notifyError("Please enter a tutor note before accepting!");
      return;
    }
    onAccept(tutorNote);
  };

  const handleRejectClick = () => {
    onReject();
  };

  // Tutor actions for Requested sessions
  if (role === "tutor" && sessionStatus === "Requested") {
    return (
      <div className="session-actions">
        <textarea
          className="tutor-note-input"
          placeholder="Enter your note..."
          value={tutorNote}
          onChange={(e) => setTutorNote(e.target.value)}
        ></textarea>

        <div className="session-actions-clean">
          <button className="accept-btn" onClick={handleAcceptClick}>
            Accept
          </button>
          <button className="reject-btn" onClick={handleRejectClick}>
            Reject
          </button>
        </div>
      </div>
    );
  }

  // Student / Non-requested sessions → View button only
  return (
    <div className="session-actions-view-wrapper">
      <button className="btn-view" onClick={onView}>
        View
      </button>
    </div>
  );
};

export default SessionActions;
