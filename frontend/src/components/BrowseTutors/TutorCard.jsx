import React, { useRef, useEffect, useState } from "react";
import "../../styles/BrowseTutors/TutorCard.css";
import { arrayBufferToBase64 } from "../../utils/fileHelper";
import { useNavigate } from "react-router-dom";

const TutorCard = ({
  tutor,
  selectedMedium,
  selectedGrade,
  selectedSubject,
}) => {
  const navigate = useNavigate();
  const cardRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  const profilePicBase64 = tutor.profilePhoto
    ? arrayBufferToBase64(tutor.profilePhoto.data)
    : null;

  const handleClick = () => {
    const user = localStorage.getItem("user");
    if (user) {
      // User is logged in, proceed to profile
      navigate(`/tutor-profile/${tutor.userId}`, {
        state: { tutorSubjectId: tutor.tutorSubjectId },
      });
    } else {
      // User is NOT logged in, store selection and redirect to login
      const selectionData = {
        path: `/tutor-profile/${tutor.userId}`,
        state: {
          tutorSubjectId: tutor.tutorSubjectId,
          medium: selectedMedium,
          grade: selectedGrade,
          subject: selectedSubject,
        },
      };

      localStorage.setItem(
        "pendingTutorSelection",
        JSON.stringify(selectionData),
      );

      navigate("/signin");
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(cardRef.current);
        }
      },
      { threshold: 0.2 },
    );

    if (cardRef.current) observer.observe(cardRef.current);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tutor-card ${isVisible ? "show" : "hidden"}`}
      onClick={handleClick}
    >
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
