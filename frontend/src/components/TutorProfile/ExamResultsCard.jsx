import React from "react";
import "../../styles/TutorProfile/ExamResultsCard.css";
import { FaListAlt } from "react-icons/fa";

const ExamResultsCard = ({ profile }) => {
  const { examResults } = profile;

  // Remove duplicates based on subjectName
  const dedupeResults = (results) => {
    if (!results) return [];
    const map = new Map();
    results.forEach((r) => {
      if (!map.has(r.subjectName)) map.set(r.subjectName, r);
    });
    return Array.from(map.values());
  };

  const olResults = dedupeResults(examResults?.OL);
  const alResults = dedupeResults(examResults?.AL);

  return (
    <div className="exam-results-card">
      <h3 className="card-title">Exam Results</h3>

      {olResults.length > 0 && (
        <div className="exam-section">
          <div className="exam-header">
            <FaListAlt className="exam-icon" />
            <h4 className="exam-subtitle">O/L Results</h4>
          </div>
          <ul className="exam-list">
            {olResults.map((res, index) => (
              <li key={index} className="exam-item">
                <span className="subject">{res.subjectName}</span>
                <span className="grade">{res.grade}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {alResults.length > 0 && (
        <div className="exam-section">
          <div className="exam-header">
            <FaListAlt className="exam-icon" />
            <h4 className="exam-subtitle">A/L Results</h4>
          </div>
          <ul className="exam-list">
            {alResults.map((res, index) => (
              <li key={index} className="exam-item">
                <span className="subject">{res.subjectName}</span>
                <span className="grade">{res.grade}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


export default ExamResultsCard;
