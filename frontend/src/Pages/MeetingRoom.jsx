import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function MeetingPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const meetingLink = params.get("link");
  const sessionId = window.location.pathname.split("/")[2]; // get /session/:id

  useEffect(() => {
    if (!meetingLink) return;

    // 1 minute (60000ms)
    const durationMs = 60 * 1000;

    const timer = setTimeout(() => {
      window.close();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [meetingLink, sessionId]);

  if (!meetingLink) return <p>Error: No meeting link.</p>;

  return (
    <iframe
      src={meetingLink}
      style={{ width: "100%", height: "100vh", border: "none" }}
      allow="camera; microphone; fullscreen; display-capture"
      title="Live Meeting"
    />
  );
}
