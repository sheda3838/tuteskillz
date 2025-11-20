import React from "react";
import "../../styles/TutorProfile/TeachingSubjectTable.css";

const TeachingSubjectsTable = ({ profile }) => {
  if (!profile.subjects || profile.subjects.length === 0)
    return (
      <div className="ts-empty-card">
        <p>No teaching subjects found.</p>
      </div>
    );

  return (
    <div className="ts-card">
      <h3 className="ts-title">Teaching Subjects</h3>

      <table className="ts-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Grade</th>
            <th>Medium</th>
          </tr>
        </thead>
        <tbody>
          {profile.subjects.map((sub) => (
            <tr key={sub.subjectId}>
              <td>{sub.subjectName}</td>
              <td>{sub.grade}</td>
              <td>{sub.teachingMedium}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeachingSubjectsTable;
