import React, { useState } from "react";
import axios from "axios";
import { notifyError, notifySuccess } from "../../utils/toast";
import "../../styles/SessionDetails/CancelSessionButton.css";

function CancelSessionButton({ sessionId, sessionStatus, onSessionCancelled }) {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!reason.trim()) {
      notifyError("Please provide a reason for cancellation.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/session/${sessionId}/status`,
        {
          status: "Cancelled",
          reason: reason,
        }
      );

      if (res.data.success) {
        notifySuccess("Session cancelled successfully.");
        setShowModal(false);
        if (onSessionCancelled) onSessionCancelled();
      } else {
        notifyError(res.data.message || "Failed to cancel session.");
      }
    } catch (err) {
      notifyError(err.response?.data?.message || "Error cancelling session.");
    } finally {
      setLoading(false);
    }
  };

  if (!["Requested", "Accepted", "Paid"].includes(sessionStatus)) {
    return null;
  }

  return (
    <>
      <button className="btn-cancel-session" onClick={() => setShowModal(true)}>
        Cancel Session
      </button>

      {showModal && (
        <div className="modal-overlay cancel-modal-overlay">
          <div className="modal-content cancel-modal-content">
            <h3>Cancel Session</h3>
            <p className="cancel-warning">
              Are you sure you want to cancel this session?
              {sessionStatus === "Paid" && (
                <span className="refund-note">
                  <br />
                  <strong>Note:</strong> Since this session is paid, the student
                  will receive a free session credit for their next booking.
                </span>
              )}
            </p>

            <textarea
              className="cancel-reason-input"
              placeholder="Please provide a reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Back
              </button>
              <button
                className="btn-confirm-cancel"
                onClick={handleCancel}
                disabled={loading}
              >
                {loading ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CancelSessionButton;
