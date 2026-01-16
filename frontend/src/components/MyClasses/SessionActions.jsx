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

  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleAcceptClick = async () => {
    if (!tutorNote.trim()) {
      notifyError("Please enter a tutor note before accepting!");
      return;
    }

    setIsAccepting(true);
    try {
      await onAccept(tutorNote);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRejectClick = async () => {
    setIsRejecting(true);
    try {
      await onReject();
    } finally {
      setIsRejecting(false);
    }
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
          disabled={isAccepting || isRejecting}
        ></textarea>

        <div className="session-actions-clean">
          <button
            className="accept-btn"
            onClick={handleAcceptClick}
            disabled={isAccepting || isRejecting}
          >
            {isAccepting ? "Accepting..." : "Accept"}
          </button>
          <button
            className="reject-btn"
            onClick={handleRejectClick}
            disabled={isAccepting || isRejecting}
          >
            {isRejecting ? "Rejecting..." : "Reject"}
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
