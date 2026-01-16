import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function MeetingPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const meetingLink = params.get("link");
  const sessionId = window.location.pathname.split("/")[2];
  const containerRef = useRef(null);

  useEffect(() => {
    if (!meetingLink || !containerRef.current) return;

    const domain = "meet.jit.si";
    const roomName = meetingLink.split("/").pop(); // extract room from URL

    const options = {
      roomName: roomName,
      parentNode: containerRef.current,
      width: "100%",
      height: "100%",
      configOverwrite: {
        disableDeepLinking: true,
      },
      interfaceConfigOverwrite: {
        DEFAULT_REMOTE_DISPLAY_NAME: "Guest",
        DEFAULT_LOCAL_DISPLAY_NAME: "Me",
        DISABLE_PRESENCE_STATUS: true,
        SHOW_JITSI_WATERMARK: false,
      },
    };

    // Load Jitsi Iframe API
    const api = new window.JitsiMeetExternalAPI(domain, options);

    return () => {
      api.dispose();
    };
  }, [meetingLink]);

  if (!meetingLink) return <p>Error: No meeting link.</p>;

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100vh", background: "#000" }}
    />
  );
}
