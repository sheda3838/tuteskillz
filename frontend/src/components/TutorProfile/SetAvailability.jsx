import React, { useState, useEffect } from "react";
import axios from "axios";
import { notifySuccess, notifyError } from "../../utils/toast";
import "../../styles/TutorProfile/SetAvailability.css";
import Loading from "../../utils/Loading";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const SetAvailability = ({ existingSlots = [], tutorId, onClose, onSaved }) => {
  axios.defaults.withCredentials = true;
  const [slots, setSlots] = useState([]);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill slots from existing data
  useEffect(() => {
    if (existingSlots.length > 0) {
      // map dayOfWeek → day
      setSlots(
        existingSlots.map((slot) => ({
          day: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        }))
      );
    } else {
      setSlots([{ day: "", startTime: "", endTime: "" }]);
    }
  }, [existingSlots]);

  // Add empty availability row
  const addSlot = () => {
    // Check for any incomplete row
    const incompleteIndex = slots.findIndex(
      (slot) => !slot.day || !slot.startTime || !slot.endTime
    );

    if (incompleteIndex !== -1) {
      notifyError(
        `Please complete row ${incompleteIndex + 1} before adding a new one.`
      );
      return;
    }

    setSlots([...slots, { day: "", startTime: "", endTime: "" }]);
  };

  const removeSlot = (index) => {
    const updated = [...slots];
    updated.splice(index, 1);

    // prevent empty state
    if (updated.length === 0) {
      updated.push({ day: "", startTime: "", endTime: "" });
    }

    setSlots(updated);
  };

  const updateSlot = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
    setErrors((prev) => ({ ...prev, [index]: "" }));
  };

  const handleCancel = () => {
    const hasComplete = slots.some(
      (slot) => slot.day && slot.startTime && slot.endTime
    );

    if (!hasComplete) {
      notifyError("You must add at least one availability before closing.");
      return;
    }

    onClose();
  };

  // Validate one row
  const validateRow = (slot) => {
    if (!slot.day) return "Please select a day.";
    if (!slot.startTime) return "Please select a start time.";
    if (!slot.endTime) return "Please select an end time.";
    if (slot.startTime >= slot.endTime)
      return "End time must be after start time.";
    return "";
  };

  // Detect conflicts per day
  const checkForConflicts = () => {
    const grouped = {};

    slots.forEach((s, i) => {
      if (!grouped[s.day]) grouped[s.day] = [];
      grouped[s.day].push({ ...s, index: i });
    });

    for (const d in grouped) {
      const arr = grouped[d].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );

      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i].endTime > arr[i + 1].startTime) {
          return `Conflicting time slots found on ${d}.`;
        }
      }
    }

    return "";
  };

  // SAVE
  const handleSave = async () => {
    setGlobalError("");
    setLoading(true); // start loading

    // Row-level validation
    let hasRowErrors = false;
    slots.forEach((slot, index) => {
      const error = validateRow(slot);
      if (error) {
        hasRowErrors = true;
        notifyError(`Row ${index + 1}: ${error}`);
      }
    });
    if (hasRowErrors) {
      setLoading(false); // stop loading if validation fails
      return;
    }

    // Conflict check
    const conflictError = checkForConflicts();
    if (conflictError) {
      notifyError(conflictError);
      setLoading(false); // stop loading
      return;
    }

    // Prepare payload
    const payload = {
      tutorId,
      availability: slots.map((slot) => ({
        dayOfWeek: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    };

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/tutor/availability`,
        payload
      );

      if (!data.success) {
        notifyError(data.message || "Failed to save availability.");
        setLoading(false);
        return;
      }

      notifySuccess("Availability saved successfully!");
      onSaved();
    } catch (err) {
      console.error("Axios error:", err);
      notifyError("Server error. Try again later.");
    } finally {
      setLoading(false); // always stop loading at the end
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Set Availability</h2>

            {globalError && (
              <div className="error global-error">{globalError}</div>
            )}

            <div className="availability-container">
              {slots.map((slot, idx) => (
                <div key={idx} className="availability-row">
                  <select
                    value={slot.day}
                    onChange={(e) => updateSlot(idx, "day", e.target.value)}
                  >
                    <option value="">Select Day</option>
                    {DAYS.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>

                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      updateSlot(idx, "startTime", e.target.value)
                    }
                  />

                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateSlot(idx, "endTime", e.target.value)}
                  />

                  <button type="button" onClick={() => removeSlot(idx)}>
                    Remove
                  </button>

                  {errors[idx] && (
                    <div className="error row-error">{errors[idx]}</div>
                  )}
                </div>
              ))}
            </div>

            <button type="button" className="addBtn" onClick={addSlot}>
              + Add Availability
            </button>

            <div className="actions">
              <button type="button" onClick={handleSave}>
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={slots.every(
                  (slot) => !slot.day && !slot.startTime && !slot.endTime
                )}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetAvailability;
