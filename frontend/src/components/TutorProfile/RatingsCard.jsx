import React from "react";
import "../../styles/TutorProfile/RatingsCard.css";

const RatingsCard = ({ ratings }) => {
  const hasRatings = ratings && ratings.length > 0;

  const avg = hasRatings
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : null;

  return (
    <div className="ratings-card">
      <h3>Ratings</h3>

      {!hasRatings ? (
        <p className="no-ratings">No ratings yet.</p>
      ) : (
        <p className="avg-rating">
          ⭐ Average Rating: <strong>{avg}</strong> / 5
        </p>
      )}
    </div>
  );
};

export default RatingsCard;
