import React from "react";
import { FaLinkedin } from "react-icons/fa";
import "../../styles/Home/Team.css";

const TeamMemberCard = ({ image, name, role, bio, linkedin }) => {
  return (
    <div className="card-container">
      <div className="card">
        {/* FRONT */}
        <div className="card-front">
          <img src={image} alt={name} className="card-image" />

          <h3 className="card-name">{name}</h3>
          <p className="card-role">{role}</p>
          <p className="card-bio">{bio}</p>
        </div>

        {/* BACK */}
        <div className="card-back">
          <h3 className="back-title">Connect With Me</h3>

          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin-button"
          >
            <FaLinkedin size={20} style={{ marginRight: "8px" }} />
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
