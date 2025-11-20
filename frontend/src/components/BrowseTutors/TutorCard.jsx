import React from "react";
import "../../styles/BrowseTutors/TutorCard.css";
import { arrayBufferToBase64 } from "../../utils/fileHelper";
import { useNavigate } from "react-router-dom";

const TutorCard = ({ tutor }) => {
  const navigate = useNavigate();

  const profilePicBase64 = tutor.profilePhoto
    ? arrayBufferToBase64(tutor.profilePhoto.data)
    : null;

  const handleClick = () => {
  navigate(`/tutor-profile/${tutor.userId}`, {
    state: { tutorSubjectId: tutor.tutorSubjectId }
  });
};


  return (
    <div className="tutor-card" onClick={handleClick}>
      <div className="tutor-card-img">
        {profilePicBase64 ? (
          <img
            src={`data:image/jpeg;base64,${profilePicBase64}`}
            alt={tutor.fullName}
          />
        ) : (
          <img src="/default-avatar.png" alt="Default Profile" />
        )}
      </div>

      <div className="tutor-card-details">
        <h3 className="tutor-name">{tutor.fullName}</h3>
        <p className="tutor-bio">{tutor.bio}</p>
      </div>
    </div>
  );
};

export default TutorCard;
