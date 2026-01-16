import React from "react";
import ProfileInfo from "./ProfileInfo";
import SessionActions from "./SessionActions";
import "../../styles/User/MyClasses.css";

const SessionCard = ({ sessionData, role, onAccept, onReject, onView }) => {
  const {
    studentName,
    tutorName,
    subjectName,
    grade,
    teachingMedium,
    date,
    startTime,
    duration,
    studentNote,
    tutorNote,
    studentProfilePhoto,
    tutorProfilePhoto,
    sessionId,
  } = sessionData;

  const displayProfile = {
    name: role === "tutor" ? studentName : tutorName,
    profilePic: role === "tutor" ? studentProfilePhoto : tutorProfilePhoto,
    roleLabel: role === "tutor" ? "Student" : "Tutor",
  };

  return (
    <div className="session-card">
      {/* Profile Section */}
      <ProfileInfo
        name={displayProfile.name}
        profilePic={displayProfile.profilePic}
        status={sessionData.sessionStatus}
      />

      {/* Tags Row */}
      <div className="session-tags">
        <span>Grade {grade}</span>
        <span>{subjectName}</span>
        <span>{teachingMedium} Medium</span>
      </div>

      <hr className="session-divider" />

      {/* Date & Time Pill */}
      <div className="session-time-pill">
        {formatDate(date)} | {formatTime(startTime)} –{" "}
        {formatTime(calculateEndTime(startTime, duration))}
      </div>

      {/* Student Notes */}
      <div className="notes-section">
        <label className="notes-label">Student Notes</label>
        {studentNote && <div className="note-box">{studentNote}</div>}
      </div>

      {/* Tutor Notes */}
      <div className="notes-section">
        <label className="notes-label">Tutor Notes</label>
        {tutorNote && <div className="note-box">{tutorNote}</div>}
      </div>

      {/* Buttons */}
      <div className="session-actions-row">
        <SessionActions
          role={role}
          sessionStatus={sessionData.sessionStatus}
          tutorNote={tutorNote}
          onAccept={(note) => onAccept(sessionId, note, date, startTime)}
          onReject={() => onReject(sessionId)}
          onView={() => onView(sessionId)}
        />
      </div>
    </div>
  );
};

// ---------- Formatting Helpers ---------- //

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(timeString) {
  const [h, m] = timeString.split(":");
  const d = new Date();
  d.setHours(h, m);

  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calculateEndTime(startTime, duration) {
  if (!startTime || !duration) return "-";
  const [hours, minutes] = startTime.split(":").map(Number);

  const end = new Date();
  end.setHours(hours + duration, minutes);

  return `${end.getHours().toString().padStart(2, "0")}:${end
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

export default SessionCard;
