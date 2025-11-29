// DownloadNotesModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/SessionDetails/DownloadNotesModal.css";
import { downloadArrayBufferAsFile } from "../../utils/fileHelper";
import { notifyError } from "../../utils/toast";
import { FaRegFileAlt } from "react-icons/fa";

function DownloadNotesModal({ isOpen, onClose, sessionId }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  // Fetch all notes for the session
  useEffect(() => {
    if (!isOpen) return;

    async function fetchNotes() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/notes/${sessionId}`,
          { responseType: "json" }
        );
        if (res.data.success) {
          setNotes(res.data.notes);
        } else {
          notifyError("Failed to fetch notes");
        }
      } catch (err) {
        notifyError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [isOpen, sessionId]);

  // Download a single note PDF
  const handleDownload = async (noteId, noteTitle) => {
    setDownloadingId(noteId);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/notes/${sessionId}/${noteId}`,
        { responseType: "blob" } // blob instead of arraybuffer
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${noteTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (res.data) {
        const buffer = res.data?.note?.document?.data || res.data; // depending on your backend blob structure
        downloadArrayBufferAsFile(
          buffer,
          `${noteTitle}.pdf`,
          "application/pdf"
        );
      } else {
        notifyError("Failed to download note");
      }
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay download-notes-modal">
      <div className="modal-content notes-modal">
        {/* Header */}
        <div className="notes-header-bar">Notes</div>

        {/* Notes List */}
        <div className="notes-list">
          {loading && <p>Loading notes...</p>}
          {!loading && notes.length === 0 && (
            <p className="no-notes">No notes uploaded yet.</p>
          )}

          {!loading &&
            notes.map((note) => (
              <div className="note-item" key={note.noteId}>
                <div className="note-left">
                  <FaRegFileAlt className="note-icon" />
                  <div className="note-text">
                    <div className="note-title">{note.title}</div>
                  </div>
                </div>

                <button
                  className="btn-download-note"
                  onClick={() => handleDownload(note.noteId, note.title)}
                  disabled={downloadingId === note.noteId}
                >
                  {downloadingId === note.noteId
                    ? "Downloading..."
                    : "Download"}
                </button>
              </div>
            ))}
        </div>

        <div className="modal-actions">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DownloadNotesModal;
