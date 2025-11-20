import React from "react";
import TutorCard from "./TutorCard";
import "../../styles/BrowseTutors/TutorCard.css";

const TutorList = ({ tutors }) => {
  if (!tutors || tutors.length === 0) return <p>No tutors available.</p>;

  return (
    <div className="tutor-list">
      {tutors.map((tutor) => (
        <TutorCard key={tutor.userId} tutor={tutor} />
      ))}
    </div>
  );
};

export default TutorList;
