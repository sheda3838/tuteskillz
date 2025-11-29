import React from "react";
import { FaVideo } from "react-icons/fa";
import "../../styles/SessionDetails/JoinMeetingButton.css";

function JoinMeetingButton({ meetingUrl }) {
  return (
    <div className="join-meeting">
      <button
        className="btn-join-meeting"
        onClick={() => window.open(meetingUrl, "_blank")}
      >
        <span className="btn-text">Join Meeting</span>
        <FaVideo className="btn-icon" />
      </button>
    </div>
  );
}

export default JoinMeetingButton;
