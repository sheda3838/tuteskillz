import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../../utils/toast";
import "../../styles/BrowseTutors/RequestSession.css";
import { authGuard } from "../../utils/authGuard";

const RequestSessionModal = ({ visible, onClose, tutorSubjectId }) => {
  const [tutorInfo, setTutorInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availability, setAvailability] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [studentNote, setStudentNote] = useState("");
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(null);

  function formatTime(timeString) {
    const [h, m] = timeString.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);

    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  useEffect(() => {
    const fetchUser = async () => {
      const user = await authGuard(navigate); // your own logic, unchanged
      if (user && user.role === "student") {
        setStudentId(user.userId);
      } else {
        notifyError("Only students can request sessions.");
        onClose();
      }
    };

    fetchUser();
  }, []);
  // Fetch tutor static info when modal opens
  useEffect(() => {
    if (!visible) return;

    axios
      .get(`/api/session/tutor-info/${tutorSubjectId}`)
      .then((res) => {
        if (res.data.success) setTutorInfo(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        notifyError("Failed to fetch tutor info");
      });
  }, [visible, tutorSubjectId]);

  // Fetch availability when date is selected
  useEffect(() => {
    if (!selectedDate || !tutorInfo) {
      setAvailability([]);
      return;
    }

    const dayOfWeek = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
    });

    axios
      .get(`/api/tutor/availability/${tutorInfo.tutorId}`)
      .then((res) => {
        if (res.data.success) {
          const slots = res.data.availability.filter(
            (slot) => slot.dayOfWeek === dayOfWeek
          );
          setAvailability(slots);
        }
      })
      .catch((err) => {
        console.error(err);
        notifyError("Failed to fetch availability");
      });
  }, [selectedDate, tutorInfo]);

  // Auto calculate end time
  useEffect(() => {
    if (!startTime) return;
    const [h, m] = startTime.split(":").map(Number);
    let endH = h + 2;
    let endM = m;
    if (endH >= 24) endH -= 24;
    const formattedEnd = `${String(endH).padStart(2, "0")}:${String(
      endM
    ).padStart(2, "0")}`;
    setEndTime(formattedEnd);
  }, [startTime]);

  const handleSubmit = async () => {
    if (!selectedDate || !startTime || !studentNote) {
      return notifyError("Please fill all required fields");
    }

    // --- Check if date + time is in the future ---
    const now = new Date();
    const selectedDateTime = new Date(`${selectedDate}T${startTime}`);
    if (selectedDateTime <= now) {
      return notifyError("Please select a date and time in the future");
    }

    const startInMinutes =
      parseInt(startTime.split(":")[0]) * 60 +
      parseInt(startTime.split(":")[1]);
    const endInMinutes =
      parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);

    const validSlot = availability.some((slot) => {
      const slotStart =
        parseInt(slot.startTime.split(":")[0]) * 60 +
        parseInt(slot.startTime.split(":")[1]);
      const slotEnd =
        parseInt(slot.endTime.split(":")[0]) * 60 +
        parseInt(slot.endTime.split(":")[1]);
      return startInMinutes >= slotStart && endInMinutes <= slotEnd;
    });

    if (!validSlot) {
      return notifyError("Selected time is not within tutor availability");
    }

    // -----------------------------
    //  CHECK STUDENT SESSION CONFLICT
    // -----------------------------
    try {
      const conflictRes = await axios.get(
        `/api/session/student/${studentId}/check-conflict`,
        {
          params: { date: selectedDate, startTime },
        }
      );
      if (conflictRes.data.conflict) {
        return notifyError("You already have a session at this time.");
      }
    } catch (err) {
      console.error(err);
      return notifyError("Failed to verify your schedule");
    }

    // -----------------------------
    //  IF NO CONFLICT, REQUEST SESSION
    // -----------------------------
    axios
      .post("/api/session/request", {
        tutorSubjectId,
        studentId,
        date: selectedDate,
        startTime,
        duration: 2,
        studentNote,
      })
      .then((res) => {
        if (res.data.success) {
          notifySuccess("Session requested successfully");
          onClose();
          navigate("/my-classes");
        } else {
          notifyError(res.data.message || "Failed to request session");
        }
      })
      .catch((err) => {
        console.error(err);
        notifyError("Failed to request session");
      });
  };

  if (!visible) return null;

  const amount = [6, 7].includes(Number(tutorInfo?.grade)) ? 500 : 700;

  return (
    <div className="request-session-modal">
      <div className="modal-content">
        <h2>Request Session</h2>
        <button className="close-btn" onClick={onClose}>
          X
        </button>

        {tutorInfo && (
          <div className="static-info">
            <div className="static-info-grid">
              <div className="static-info-item">
                <span className="static-info-label">Tutor</span>
                <span className="static-info-value">{tutorInfo.tutorName}</span>
              </div>
              <div className="static-info-item">
                <span className="static-info-label">Duration</span>
                <span className="static-info-value">2 Hours</span>
              </div>
              <div className="static-info-item">
                <span className="static-info-label">Amount</span>
                <span className="static-info-value">LKR {amount}.00</span>
              </div>
              <div className="static-info-item">
                <span className="static-info-label">Medium</span>
                <span className="static-info-value">
                  {tutorInfo.teachingMedium}
                </span>
              </div>
              <div className="static-info-item">
                <span className="static-info-label">Grade</span>
                <span className="static-info-value">{tutorInfo.grade}</span>
              </div>
              <div className="static-info-item">
                <span className="static-info-label">Subject</span>
                <span className="static-info-value">
                  {tutorInfo.subjectName}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="form-grp">
          <div className="form-row">
            <label>Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        {/* Availability */}
        {selectedDate && availability.length > 0 ? (
          <div className="form-grp">
            <div className="time-row">
              <label>Start Time:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <p>End Time: {endTime}</p>
            </div>

            <p>Available Slots:</p>
            <ul>
              {availability.map((slot, idx) => (
                <li key={idx}>
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                </li>
              ))}
            </ul>
          </div>
        ) : selectedDate ? (
          <p className="no-availability-msg">
            No available time slots for this tutor on the selected date.
          </p>
        ) : null}

        <div className="form-grp">
          <label>Student Note:</label>
          <textarea
            placeholder="Please focus on matrices and determinants for my upcoming exam."
            value={studentNote}
            onChange={(e) => setStudentNote(e.target.value)}
          />
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Request Session
        </button>
      </div>
    </div>
  );
};

export default RequestSessionModal;
