import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "../../styles/SessionDetails/FeedbackComponent.css";

function FeedbackComponent({ role, sessionStatus, feedbackData }) {
  const { studentFeedback, tutorFeedback } = feedbackData;

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  if (sessionStatus !== "Completed") return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Feedback: ", { rating, comment });
  };

  return (
    <div className="feedback-card">
      <h3 className="feedback-header">Rate Session</h3>

      {(role === "student" || role === "tutor") && (
        <form className="feedback-form" onSubmit={handleSubmit}>
          {/* ⭐⭐⭐⭐⭐ STAR RATING */}
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className="star"
                size={30}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                color={(hover || rating) >= star ? "#03A4A4" : "#C4C4C4"}
              />
            ))}
          </div>

          {/* COMMENT BOX */}
          <textarea
            className="feedback-textarea"
            placeholder="E.g., I enjoyed the session; the tutor was patient and answered all my questions"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button className="btn-submit">Submit</button>
        </form>
      )}

      {/* 🟦 FEEDBACK DISPLAY */}
      {role === "student" && (
        <div className="feedback-display">
          <h4>Tutor’s Feedback</h4>
          <p>{tutorFeedback?.comment || "No feedback yet."}</p>
        </div>
      )}

      {role === "tutor" && (
        <div className="feedback-display">
          <h4>Student’s Feedback</h4>
          <p>{studentFeedback?.comment || "No feedback yet."}</p>
        </div>
      )}

      {role === "admin" && (
        <div className="feedback-admin">
          <div className="admin-block">
            <h4>Student → Tutor</h4>
            <p>Rating: {studentFeedback?.rating ?? "N/A"}</p>
            <p>Comment: {studentFeedback?.comment || "No comment"}</p>
          </div>

          <div className="admin-block">
            <h4>Tutor → Student</h4>
            <p>Rating: {tutorFeedback?.rating ?? "N/A"}</p>
            <p>Comment: {tutorFeedback?.comment || "No comment"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackComponent;
