import React from "react";
import "../../styles/BrowseTutors/SelectorBox.css";

const MediumSelector = ({ mediums, selected, onSelect }) => {
  return (
    <div className="selector-container">
      <h2>Choose Your Medium</h2>

      <div className="selector-box-wrapper">
        {mediums.map((medium) => (
          <button
            key={medium}
            onClick={() => onSelect(medium)}
            className={`selector-box ${selected === medium ? "selected" : ""}`}
          >
            {medium}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MediumSelector;
