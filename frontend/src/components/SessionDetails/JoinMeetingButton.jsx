import React from "react";
import { FaVideo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/SessionDetails/JoinMeetingButton.css";

function JoinMeetingButton({ canJoin, countdown, meetingLink, sessionId }) {

  const handleJoin = () => {
    if (!meetingLink) return;

    // Open React route in a NEW TAB
    window.open(
      `/session/${sessionId}/meeting?link=${encodeURIComponent(meetingLink)}`,
      "_blank"
    );
  };

  return (
    <div className="join-meeting">
      <button
        className="btn-join-meeting"
        onClick={handleJoin}
        disabled={!canJoin}
      >
        {canJoin ? "Join Meeting" : `Join available in ${countdown}`}
      </button>
    </div>
  );
}



export default JoinMeetingButton;
