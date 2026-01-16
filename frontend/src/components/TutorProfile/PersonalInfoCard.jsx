import React from "react";
import "../../styles/TutorProfile/PersonalInfoCard.css";

const PersonalInfoCard = ({ profile }) => {
  return (
    <div className="personal-info-card">
      <h3 className="card-title">Personal Information</h3>

      <div className="info-grid">
        <div className="info-item">
          <span className="label">Full Name:</span>
          <span className="value">{profile.fullName}</span>
        </div>

        <div className="info-item">
          <span className="label">Email:</span>
          <span className="value">{profile.email}</span>
        </div>

        <div className="info-item">
          <span className="label">Phone:</span>
          <span className="value">{profile.phone || "N/A"}</span>
        </div>

        <div className="info-item">
          <span className="label">Date of Birth:</span>
          <span className="value">
            {profile.DOB
              ? new Date(profile.DOB).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
