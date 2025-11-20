// TutorVerification.jsx
import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../styles/TutorProfile/TutorVerification.css";
import { notifyError, notifySuccess } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

const TutorVerification = () => {
  const [olText, setOlText] = useState("");
  const [alText, setAlText] = useState("");
  const [olResults, setOlResults] = useState([]);
  const [alResults, setAlResults] = useState([]);
  const [showALTextarea, setShowALTextarea] = useState(false);
  const { id: tutorId } = useParams();

  const grades = ["A", "B", "C", "F", "S", "W"];
  const admin = JSON.parse(localStorage.getItem("admin"));

  const navigate = useNavigate();
  const dedupeResults = (results) => {
    const map = new Map();
    results.forEach((r) => {
      const key = r.subject.trim().toLowerCase(); // use lowercase to avoid case duplicates
      if (!map.has(key)) map.set(key, r);
    });
    return Array.from(map.values());
  };

  // Parse OL Transcript
  const handleParseOL = async () => {
    if (!olText.trim()) return notifyError("Please enter OL transcript text");

    try {
      const res = await axios.post("/api/admin/tutor/parse-text", {
        transcriptText: olText,
      });
      const deduped = dedupeResults(res.data.results);
      setOlResults(deduped);
      setShowALTextarea(true);
    } catch (error) {
      notifyError("Error parsing OL transcript");
    }
  };

  // Parse AL Transcript
  const handleParseAL = async () => {
    if (!alText.trim()) return notifyError("Please enter AL transcript text");

    try {
      const res = await axios.post("/api/admin/tutor/parse-text", {
        transcriptText: alText,
      });
      const deduped = dedupeResults(res.data.results);
      setAlResults(deduped);
    } catch (error) {
      notifyError("Error parsing AL transcript");
    }
  };

  // Handle changes in table inputs
  const handleOLChange = (index, field, value) => {
    const newResults = [...olResults];
    newResults[index][field] = value;
    setOlResults(newResults);
  };

  const handleALChange = (index, field, value) => {
    const newResults = [...alResults];
    newResults[index][field] = value;
    setAlResults(newResults);
  };

  // Approve button click
  const handleApprove = async () => {
    if (!admin || !admin.userId) return alert("Admin info missing");

    try {
      // Deduplicate before saving
      const dedupedOL = dedupeResults(olResults);
      const dedupedAL = dedupeResults(alResults);

      // 1️⃣ Save OL results
      if (dedupedOL.length > 0) {
        await axios.post(`/api/admin/tutor/save-results/${tutorId}/OL`, {
          results: dedupedOL,
        });
      }

      // 2️⃣ Save AL results
      if (dedupedAL.length > 0) {
        await axios.post(`/api/admin/tutor/save-results/${tutorId}/AL`, {
          results: dedupedAL,
        });
      }

      // 3️⃣ Approve tutor
      await axios.post(`/api/admin/tutor/approve/${tutorId}`, {
        adminId: admin.userId,
        verifiedNotes: "Approved by admin",
      });

      notifySuccess("Tutor verified successfully!");
      navigate("/admin/tutors")
    } catch (err) {
      notifyError(
        "Error approving tutor: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="verification-container">
      <h2>Tutor Verification</h2>

      {/* OL Section */}
      <div className="section-block">
        <h3 className="section-title">Paste OL Transcript:</h3>
        <textarea
          rows={6}
          className="verification-textarea"
          value={olText}
          onChange={(e) => setOlText(e.target.value)}
          placeholder="Paste OL transcript here..."
        />
        <button className="parse-btn" onClick={handleParseOL}>
          Parse OL
        </button>

        {olResults.length > 0 && (
          <table className="results-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {olResults.map((res, i) => (
                <tr key={i}>
                  <td>
                    <input
                      type="text"
                      value={res.subject}
                      onChange={(e) =>
                        handleOLChange(i, "subject", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={res.grade}
                      onChange={(e) =>
                        handleOLChange(i, "grade", e.target.value)
                      }
                    >
                      {grades.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* AL Section */}
      {showALTextarea && (
        <div className="section-block">
          <h3 className="section-title">Paste AL Transcript:</h3>
          <textarea
            rows={6}
            className="verification-textarea"
            value={alText}
            onChange={(e) => setAlText(e.target.value)}
            placeholder="Paste AL transcript here..."
          />
          <button className="parse-btn" onClick={handleParseAL}>
            Parse AL
          </button>

          {alResults.length > 0 && (
            <table className="results-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {alResults.map((res, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        type="text"
                        value={res.subject}
                        onChange={(e) =>
                          handleALChange(i, "subject", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={res.grade}
                        onChange={(e) =>
                          handleALChange(i, "grade", e.target.value)
                        }
                      >
                        {grades.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {(olResults.length > 0 || alResults.length > 0) && (
        <button className="approve-btn" onClick={handleApprove}>
          Approve
        </button>
      )}
    </div>
  );
};

export default TutorVerification;
