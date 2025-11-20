import React from "react";
import "../../styles/BrowseTutors/SelectorBox.css";

const SubjectSelector = ({ subjects, selected, onSelect }) => {
  return (
    <div className="selector-container">
      <h2>Choose Your Subject</h2>

      <div className="selector-box-wrapper">
        {subjects.map((subject) => (
          <button
            key={subject.subjectId}
            onClick={() => onSelect(subject.subjectId)}
            className={`selector-box ${
              selected === subject.subjectId ? "selected" : ""
            }`}
          >
            {subject.subjectName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;
