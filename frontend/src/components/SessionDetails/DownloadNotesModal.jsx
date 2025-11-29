import React from "react";
import "../../styles/SessionDetails/DownloadNotesModal.css";

function DownloadNotesModal({ isOpen, onClose, notes }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay download-notes-modal">
      <div className="modal-content notes-modal">

        {/* Header */}
        <div className="notes-header-bar">
          Notes
        </div>

        {/* Notes List */}
        <div className="notes-list">
          {notes.length === 0 && (
            <p className="no-notes">No notes uploaded yet.</p>
          )}

          {notes.map((note, idx) => (
            <div className="note-item" key={idx}>
              <div className="note-left">
                <img
                  src="/note-icon.png"
                  alt="Note"
                  className="note-icon"
                />
                <div className="note-text">
                  <div className="note-title">{note.title}</div>
                </div>
              </div>

              <button
                className="btn-download-note"
                onClick={() => window.open(note.pdfUrl, "_blank")}
              >
                Download
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
