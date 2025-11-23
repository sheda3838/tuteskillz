import React, { useState } from "react";
import "../../styles/TutorProfile/AdminverificationControl.css";

const AdminVerificationControls = ({ onVerify, onRejectSubmit }) => {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectNote, setRejectNote] = useState("");

  // Show the textarea for rejection note
  const handleRejectClick = () => {
    setShowRejectInput(true);
  };

  // Validate and submit rejection
  const handleRejectSubmit = () => {
    const trimmedNote = rejectNote.trim();
    if (!trimmedNote) {
      alert("Please type a rejection note before submitting."); // user-friendly feedback
      return;
    }

    // Call backend function passed from parent
    onRejectSubmit(trimmedNote);

    // Reset state
    setRejectNote("");
    setShowRejectInput(false);
  };

  return (
    <div className=" admin-verification-controls">
      <h3>Admin Controls</h3>

      <div className="admin-btn-group">
        <button onClick={onVerify}>Accept</button>
        <button onClick={handleRejectClick} className="danger">
          Reject
        </button>
      </div>

      {showRejectInput && (
        <div className="reject-note-input">
          <textarea
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder="Type rejection note..."
            rows={4}
          />
          <button onClick={handleRejectSubmit} className="danger">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminVerificationControls;
