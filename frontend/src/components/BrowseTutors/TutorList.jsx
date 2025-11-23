import React, { useState, useMemo } from "react";
import TutorCard from "./TutorCard";
import "../../styles/BrowseTutors/TutorCard.css";

const TutorList = ({ tutors }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tutors based on search query (case-insensitive)
  const filteredTutors = useMemo(() => {
    if (!tutors) return [];
    return tutors.filter((tutor) =>
      tutor.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tutors, searchQuery]);

  return (
    <div className="tutor-list-container">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search tutors by name..."
        className="tutor-search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Tutors */}
      {filteredTutors.length === 0 ? (
        <p>No tutors found.</p>
      ) : (
        <div className="tutor-list">
          {filteredTutors.map((tutor) => (
            <TutorCard key={tutor.userId} tutor={tutor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorList;
