import React from "react";
import "../../styles/BrowseTutors/SelectorBox.css";

const GradeSelector = ({ grades, selected, onSelect }) => {
  return (
    <div className="selector-container">
      <h2>Choose Your Grade</h2>

      <div className="selector-box-wrapper">
        {grades.map((grade) => (
          <button
            key={grade}
            onClick={() => onSelect(grade)}
            className={`selector-box ${selected === grade ? "selected" : ""}`}
          >
            {grade}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GradeSelector;
