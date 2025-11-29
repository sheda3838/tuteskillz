import React from "react";
import { arrayBufferToBase64 } from "../../utils/fileHelper";
import { FaGraduationCap, FaUserGraduate } from "react-icons/fa";
import "../../styles/SessionDetails/SessionHeader.css"; 

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(timeString) {
  if (!timeString) return "";
  const [h, m] = timeString.split(":");
  const d = new Date();
  d.setHours(h, m);

  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getProfileImage(photoBuffer) {
  if (!photoBuffer || !photoBuffer.data) return "/default-avatar.png";
  return `data:image/jpeg;base64,${arrayBufferToBase64(photoBuffer.data)}`;
}

function SessionHeader({ student, tutor, session }) {
  const { medium, grade, subject, date, time, status, studentNote, tutorNote } =
    session;

  return (
    <div className="session-header-container">

      {/* Participants */}
      <div className="participants-card">
        {/* Student */}
        <div className="participant">
          <img
            src={getProfileImage(student.profilePic)}
            alt="Student"
            className="participant-img"
          />
          <div className="participant-info">
            <h4 className="participant-name">
              {student.fullName} <FaUserGraduate />
            </h4>
            <span className="participant-role">Student</span>
          </div>
        </div>

        {/* Tutor */}
        <div className="participant">
          <img
            src={getProfileImage(tutor.profilePic)}
            alt="Tutor"
            className="participant-img"
          />
          <div className="participant-info">
            <h4 className="participant-name">
              {tutor.fullName} <FaGraduationCap />
            </h4>
            <span className="participant-role">Tutor</span>
          </div>
        </div>
      </div>

      {/* Session Info */}
      <div className="session-info-card">
        <h3 className="section-title">Session Information</h3>

        <div className="info-grid">
          <div className="info-row"><span>Medium:</span> {medium}</div>
          <div className="info-row"><span>Grade:</span> {grade}</div>
          <div className="info-row"><span>Subject:</span> {subject}</div>
          <div className="info-row"><span>Date:</span> {formatDate(date)}</div>
          <div className="info-row"><span>Time:</span> {formatTime(time)}</div>
        </div>

        <div className={`session-status ${status.toLowerCase()}`}>
          {status}
        </div>
      </div>

      {/* Notes */}
      <div className="session-notes-card">
        <h3 className="section-title">Session Notes</h3>

        <div className="note-box">
          <strong>Student Note:</strong>
          <p>{studentNote || "No notes added."}</p>
        </div>

        <div className="note-box">
          <strong>Tutor Note:</strong>
          <p>{tutorNote || "No notes added."}</p>
        </div>
      </div>
    </div>
  );
}

export default SessionHeader;
