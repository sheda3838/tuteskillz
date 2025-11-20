import React from "react";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import "../../styles/Home/Team.css";

const TeamMemberCard = ({ image, name, role, bio, linkedin, gmail }) => {
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
          <div className="card-socials">
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={30} />
            </a>

            <a href={`mailto:${gmail}`}>
              <FaEnvelope size={30} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeamMemberCard;
