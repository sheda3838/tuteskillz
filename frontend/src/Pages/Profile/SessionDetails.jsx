import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import SessionHeader from "../../components/SessionDetails/SessionHeader";
import MakePayment from "../../components/SessionDetails/MakePayment";
import UploadNotesModal from "../../components/SessionDetails/UploadNotesModal";
import DownloadNotesModal from "../../components/SessionDetails/DownloadNotesModal";
import JoinMeetingButton from "../../components/SessionDetails/JoinMeetingButton";
import FeedbackComponent from "../../components/SessionDetails/FeedbackComponent";
import CancelSessionButton from "../../components/SessionDetails/CancelSessionButton";
import Loading from "../../utils/Loading";
import { localAuthGuard } from "../../utils/LocalAuthGuard";

import "../../styles/SessionDetails/SessionDetails.css";
import { notifyError, notifySuccess } from "../../utils/toast";

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

  const [user, setUser] = useState(null);

  // 🔥 Countdown and join logic
  const [timeLeft, setTimeLeft] = useState(null);
  const [canJoin, setCanJoin] = useState(false);
  const JOIN_THRESHOLD = 10 * 60 * 1000; // 10 minutes before session

  // 🔥 Fetch logged-in user info
  useEffect(() => {
    const currentUser = localAuthGuard(navigate);
    if (!currentUser) return; // redirect handled inside localAuthGuard
    setUser(currentUser);
  }, [navigate]);

  // 🔥 Fetch session details & Handle Payment Return
  useEffect(() => {
    if (!user) return;

    async function loadSession() {
      try {
        // Check for PayHere return params (order_id)
        const searchParams = new URLSearchParams(window.location.search);
        const orderId = searchParams.get("order_id");

        if (orderId && orderId === sessionId) {
          // Simulate Webhook for Localhost Dev
          try {
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/payment/payhere/simulate`,
              {
                order_id: orderId,
                amount: "1000.00", // Default amount
              },
            );
            notifySuccess("Payment verified successfully!");
            // Clear query params to avoid re-triggering
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            );
          } catch (simErr) {
            console.error("Payment verification failed:", simErr);
          }
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/session/${sessionId}`,
        );
        const data = res.data.data;
        setSession(data);

        // Load student & tutor info
        const studentReq = axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/student/${data.studentId}`,
        );
        const tutorReq = axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/tutor/${data.tutorId}`,
        );

        const [studentRes, tutorRes] = await Promise.all([
          studentReq,
          tutorReq,
        ]);

        setStudent(studentRes.data.data);
        setTutor(tutorRes.data.data);
      } catch (err) {
        notifyError(err);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [sessionId, user]);

  // 🔥 Countdown timer effect
  useEffect(() => {
    if (!session || !session.date) return;

    const utcDate = new Date(session.date); // Converts UTC → local SL time

    const [h, m, s] = session.startTime.split(":").map(Number);

    // Apply the correct local session start time
    utcDate.setHours(h, m, s || 0, 0);

    const sessionStart = utcDate;

    // ✅ Define session duration in ms
    const sessionDurationMs = (session.duration || 2) * 60 * 60 * 1000; // 2 hrs default

    const interval = setInterval(() => {
      const now = new Date();
      const diff = sessionStart - now;
      setTimeLeft(diff);

      if (diff <= JOIN_THRESHOLD && diff + sessionDurationMs > 0) {
        setCanJoin(true);
      } else {
        setCanJoin(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  if (loading || !session || !student || !tutor || !user) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  const formatCountdown = (ms) => {
    if (ms <= 0) return "0s";

    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    let str = "";
    if (days) str += `${days}d `;
    if (hours) str += `${hours}h `;
    if (minutes) str += `${minutes}m `;
    str += `${seconds}s`;

    return str.trim();
  };

  const role = user.role;
  const status = session.sessionStatus;

  return (
    <div className="session-details-page">
      <div className="session-details-wrapper">
        <button
          className="btn-back-nav"
          onClick={() => {
            if (role === "admin") {
              navigate("/admin/sessions");
            } else if (role === "tutor") {
              navigate("/tutor/dashboard");
            } else {
              navigate("/my-classes");
            }
          }}
        >
          &larr;{" "}
          {role === "admin"
            ? "Back to Sessions"
            : role === "tutor"
              ? "Back to Dashboard"
              : "Back to My Classes"}
        </button>

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
              <MakePayment student={student} sessionId={sessionId} />
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
              <button
                className="btn-open-upload"
                onClick={() => setShowUploadModal(true)}
              >
                Upload Notes
              </button>
            )}
            {(role === "student" || role === "admin" || role === "tutor") && (
              <button
                className="btn-open-download"
                onClick={() => setShowDownloadModal(true)}
              >
                {role === "tutor" ? "View Notes" : "Download Notes"}
              </button>
            )}

            <UploadNotesModal
              isOpen={showUploadModal}
              onClose={() => setShowUploadModal(false)}
              onSubmit={async ({ title, file }) => {
                const formData = new FormData();
                formData.append("sessionId", sessionId);
                formData.append("title", title);
                formData.append("file", file);

                await axios.post(
                  `${import.meta.env.VITE_BACKEND_URL}/notes/upload`,
                  formData,
                  {
                    headers: { "Content-Type": "multipart/form-data" },
                  },
                );

                // Refresh session to show new notes
                const res = await axios.get(
                  `${import.meta.env.VITE_BACKEND_URL}/session/${sessionId}`,
                );
                setSession(res.data.data);
              }}
            />

            <DownloadNotesModal
              isOpen={showDownloadModal}
              onClose={() => setShowDownloadModal(false)}
              sessionId={sessionId}
              role={role}
            />
          </div>
        )}

        {/* Join Meeting Button */}
        {status === "Paid" && session.meetingUrl && (
          <JoinMeetingButton
            canJoin={canJoin}
            countdown={formatCountdown(timeLeft)}
            meetingLink={session.meetingUrl.trim()}
          />
        )}

        {/* COMPLETED */}
        {status === "Completed" && (
          <div className="section-card">
            <FeedbackComponent
              role={role}
              sessionStatus={status}
              sessionId={sessionId}
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

        {/* Cancel Session Button (Visible for Requested, Accepted, Paid) */}
        <CancelSessionButton
          sessionId={sessionId}
          sessionStatus={status}
          onSessionCancelled={() => {
            // Reload session data
            window.location.reload();
          }}
        />
      </div>
    </div>
  );
}

export default SessionDetails;
