import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/SessionDetails/DownloadNotesModal.css";
import { downloadArrayBufferAsFile } from "../../utils/fileHelper";
import { notifyError, notifySuccess } from "../../utils/toast";
import { FaRegFileAlt, FaTrash } from "react-icons/fa";

function DownloadNotesModal({ isOpen, onClose, sessionId, role }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);

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

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${noteTitle}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/notes/${noteToDelete.noteId}`
      );
      notifySuccess("Note deleted successfully");
      setNotes((prev) => prev.filter((n) => n.noteId !== noteToDelete.noteId));
      setNoteToDelete(null);
    } catch (err) {
      notifyError(err?.response?.data?.message || "Failed to delete note");
    }
  };

  const cancelDelete = () => {
    setNoteToDelete(null);
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

                <div className="note-actions">
                  <button
                    className="btn-download-note"
                    onClick={() => handleDownload(note.noteId, note.title)}
                    disabled={downloadingId === note.noteId}
                  >
                    {downloadingId === note.noteId
                      ? "Downloading..."
                      : "Download"}
                  </button>
                  {role === "tutor" && (
                    <button
                      className="btn-delete-note"
                      onClick={() => handleDeleteClick(note)}
                      title="Delete Note"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>

        <div className="modal-actions">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {noteToDelete && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-box">
              <h3>Delete Note?</h3>
              <p>Are you sure you want to delete "{noteToDelete.title}"?</p>
              <div className="delete-actions">
                <button className="btn-cancel" onClick={cancelDelete}>
                  Cancel
                </button>
                <button className="btn-confirm-delete" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DownloadNotesModal;
