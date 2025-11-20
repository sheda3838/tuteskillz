import React from "react";
import "../../styles/TutorProfile/SchoolUniversityCard.css";
import { FaSchool, FaUniversity } from "react-icons/fa";

const SchoolUniversityCard = ({ profile }) => {
  return (
    <div className="school-university-card">
      <h3 className="card-title">Education</h3>

      <div className="edu-row">
        <div className="edu-item">
        <FaSchool className="edu-icon" />
        <div className="edu-text">
          <span className="label">School:</span>
          <span className="value">{profile.school || "N/A"}</span>
        </div>
      </div>

      <div className="edu-item">
        <FaUniversity className="edu-icon" />
        <div className="edu-text">
          <span className="label">University:</span>
          <span className="value">{profile.university || "N/A"}</span>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SchoolUniversityCard;
