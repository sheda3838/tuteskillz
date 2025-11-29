import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import SessionHeader from "../../components/SessionDetails/SessionHeader";
import MakePayment from "../../components/SessionDetails/MakePayment";
import UploadNotesModal from "../../components/SessionDetails/UploadNotesModal";
import DownloadNotesModal from "../../components/SessionDetails/DownloadNotesModal";
import JoinMeetingButton from "../../components/SessionDetails/JoinMeetingButton";
import FeedbackComponent from "../../components/SessionDetails/FeedbackComponent";
import Loading from "../../utils/Loading";
import { localAuthGuard } from "../../utils/LocalAuthGuard";

import "../../styles/SessionDetails/SessionDetails.css";

function SessionDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const sessionId = id;

  const [session, setSession] = useState(null);
  const [student, setStudent] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // 🔥 Fetch logged-in user info
  const [user, setUser] = useState(null);
  useEffect(() => {
    const currentUser = localAuthGuard(navigate);
    if (!currentUser) return; // redirect handled inside localAuthGuard
    setUser(currentUser);
  }, [navigate]);

  // 🔥 Fetch session details
  useEffect(() => {
    if (!user) return; // wait until user is loaded
    async function loadSession() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/session/${sessionId}`
        );
        const data = res.data.data;
        setSession(data);

        // Load student & tutor info
        const studentReq = axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/student/${data.studentId}`
        );
        const tutorReq = axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/tutor/${data.tutorId}`
        );

        const [studentRes, tutorRes] = await Promise.all([studentReq, tutorReq]);

        setStudent(studentRes.data.data);
        setTutor(tutorRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [sessionId, user]);

  if (loading || !session || !student || !tutor || !user) {
    return <div className="loading"><Loading /></div>;
  }

  const role = user.role; // get role from logged-in user
  const status = session.sessionStatus;

  return (
    <div className="session-details-page">
      <div className="session-details-wrapper">

        {/* Header */}
        <SessionHeader
          student={{
            fullName: student.fullName,
            profilePic: student.profilePhoto,
          }}
          tutor={{
            fullName: tutor.fullName,
            profilePic: tutor.profilePhoto,
          }}
          session={{
            medium: session.teachingMedium,
            grade: session.grade,
            subject: session.subjectName,
            date: session.date,
            time: session.startTime,
            status: session.sessionStatus,
            studentNote: session.studentNote,
            tutorNote: session.tutorNote,
          }}
        />

        {/* ACCEPTED */}
        {status === "Accepted" && (
          <div className="section-card">
            {role === "student" && (
              <MakePayment onPayment={() => console.log("Payment clicked")} />
            )}
            {(role === "tutor" || role === "admin") && (
              <p className="pending-payment-msg">
                Student has not made the payment yet.
              </p>
            )}
          </div>
        )}

        {/* PAID */}
        {status === "Paid" && (
          <div className="section-card">
            {role === "tutor" && (
              <button className="btn-open-upload" onClick={() => setShowUploadModal(true)}>
                Upload Notes
              </button>
            )}
            {(role === "student" || role === "admin") && (
              <button className="btn-open-download" onClick={() => setShowDownloadModal(true)}>
                Download Notes
              </button>
            )}

            <JoinMeetingButton meetingUrl={session.zoomUrl} />

            <UploadNotesModal
              isOpen={showUploadModal}
              onClose={() => setShowUploadModal(false)}
              onSubmit={() => console.log("Notes uploaded")}
            />

            <DownloadNotesModal
              isOpen={showDownloadModal}
              onClose={() => setShowDownloadModal(false)}
              notes={session.notes || []}
            />
          </div>
        )}

        {/* COMPLETED */}
        {status === "Completed" && (
          <div className="section-card">
            <FeedbackComponent
              role={role}
              sessionStatus={status}
              feedbackData={{
                studentFeedback: session.studentFeedback || null,
                tutorFeedback: session.tutorFeedback || null,
              }}
            />
          </div>
        )}

        {/* CANCELLED / DECLINED */}
        {(status === "Declined" || status === "Cancelled") && (
          <div className="section-card cancelled-box">
            <p className="session-cancelled-msg">
              This session has been {status.toLowerCase()}.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default SessionDetails;
