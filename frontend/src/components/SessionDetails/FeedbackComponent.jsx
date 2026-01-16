import React, { useState, useEffect } from "react";
import { FaStar, FaPen } from "react-icons/fa";
import axios from "axios";
import "../../styles/SessionDetails/FeedbackComponent.css";
import { notifySuccess, notifyError } from "../../utils/toast";

function FeedbackComponent({ role, sessionStatus, sessionId }) {
  const [myFeedback, setMyFeedback] = useState(null);
  const [partnerFeedback, setPartnerFeedback] = useState(null);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTimeLeft, setEditTimeLeft] = useState(null);

  if (sessionStatus !== "Completed") return null;

  const fetchFeedback = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/feedback/${sessionId}`
      );
      if (res.data.success) {
        const { studentFeedback, tutorFeedback } = res.data.data;
        if (role === "student") {
          setMyFeedback(studentFeedback);
          setPartnerFeedback(tutorFeedback);
        } else if (role === "tutor") {
          setMyFeedback(tutorFeedback);
          setPartnerFeedback(studentFeedback);
        } else {
          // Admin view
          setMyFeedback(null);
          setPartnerFeedback({
            student: studentFeedback,
            tutor: tutorFeedback,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch feedback", err);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [sessionId, role]);

  // Handle Edit Timer
  useEffect(() => {
    if (!myFeedback) return;

    const checkTimer = () => {
      const createdAt = new Date(myFeedback.createdAt);
      const now = new Date();
      const diffMins = (now - createdAt) / 1000 / 60;
      const remaining = 30 - diffMins;

      if (remaining > 0) {
        setEditTimeLeft(Math.ceil(remaining));
      } else {
        setEditTimeLeft(0);
        setIsEditing(false); // Force exit edit mode
      }
    };

    checkTimer();
    const interval = setInterval(checkTimer, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [myFeedback]);

  const handleEditClick = () => {
    if (editTimeLeft <= 0) return;
    setRating(myFeedback.rating);
    setComment(myFeedback.comments);
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return notifyError("Please provide a rating");
    if (!comment.trim()) return notifyError("Please provide a comment");

    try {
      if (isEditing) {
        // Update
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/feedback/${
            myFeedback.feedbackId
          }`,
          { rating, comments: comment }
        );
        notifySuccess("Feedback updated");
        setIsEditing(false);
      } else {
        // Create
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/feedback`, {
          sessionId,
          rating,
          comments: comment,
          givenBy: role,
        });
        notifySuccess("Feedback submitted");
      }
      fetchFeedback(); // Refresh
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to submit feedback");
    }
  };

  const renderStars = (currentRating, interactive = false) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`star ${interactive ? "interactive" : ""}`}
          size={interactive ? 30 : 20}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && setRating(star)}
          color={
            (interactive ? hover || rating : currentRating) >= star
              ? "#03A4A4"
              : "#C4C4C4"
          }
          style={{ cursor: interactive ? "pointer" : "default" }}
        />
      ))}
    </div>
  );

  // Admin View
  if (role === "admin") {
    const sFeedback = partnerFeedback?.student;
    const tFeedback = partnerFeedback?.tutor;
    return (
      <div className="feedback-card">
        <h3 className="feedback-header">Session Feedback</h3>
        <div className="feedback-admin-grid">
          <div className="admin-block">
            <h4>Student's Feedback</h4>
            {sFeedback ? (
              <>
                {renderStars(sFeedback.rating)}
                <p className="feedback-text">"{sFeedback.comments}"</p>
              </>
            ) : (
              <p className="no-feedback">Not submitted yet</p>
            )}
          </div>
          <div className="admin-block">
            <h4>Tutor's Feedback</h4>
            {tFeedback ? (
              <>
                {renderStars(tFeedback.rating)}
                <p className="feedback-text">"{tFeedback.comments}"</p>
              </>
            ) : (
              <p className="no-feedback">Not submitted yet</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Student/Tutor View
  return (
    <div className="feedback-card">
      <h3 className="feedback-header">Session Feedback</h3>

      {/* MY FEEDBACK SECTION */}
      <div className="my-feedback-section">
        {!myFeedback || isEditing ? (
          <form className="feedback-form" onSubmit={handleSubmit}>
            <h4>{isEditing ? "Edit Your Feedback" : "Rate this Session"}</h4>
            {renderStars(rating, true)}
            <textarea
              className="feedback-textarea"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="form-actions">
              <button className="btn-submit">
                {isEditing ? "Update" : "Submit"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="submitted-feedback">
            <div className="feedback-header-row">
              <h4>Your Feedback</h4>
              {editTimeLeft > 0 && (
                <button className="btn-edit-feedback" onClick={handleEditClick}>
                  <FaPen size={12} /> Edit ({editTimeLeft}m left)
                </button>
              )}
            </div>
            {renderStars(myFeedback.rating)}
            <p className="feedback-text">"{myFeedback.comments}"</p>
          </div>
        )}
      </div>

      <hr className="feedback-divider" />

      {/* PARTNER FEEDBACK SECTION */}
      <div className="partner-feedback-section">
        <h4>
          {role === "student" ? "Tutor's Feedback" : "Student's Feedback"}
        </h4>
        {partnerFeedback ? (
          <div className="partner-feedback-content">
            {renderStars(partnerFeedback.rating)}
            <p className="feedback-text">"{partnerFeedback.comments}"</p>
          </div>
        ) : (
          <p className="no-feedback">Waiting for feedback...</p>
        )}
      </div>
    </div>
  );
}

export default FeedbackComponent;
