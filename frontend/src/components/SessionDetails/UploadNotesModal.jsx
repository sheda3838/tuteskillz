import React from "react";
import { FaTimes, FaFileUpload } from "react-icons/fa";
import "../../styles/SessionDetails/UploadNotesModal.css";

function UploadNotesModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay upload-notes-modal">
      <div className="upload-modal-container">
        <div className="upload-modal-header">
          <h2>Upload Notes</h2>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>

        <form
          className="upload-notes-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="form-grp">
            <label>Title</label>
            <input type="text" className="input-field" required />
          </div>

          <div className="form-grp">
            <label>Description</label>
            <textarea className="input-field textarea" required></textarea>
          </div>

          <div className="form-grp">
            <label>File Upload</label>

            <div className="upload-box">
              <FaFileUpload className="upload-icon" />
              <p>
                Drag and drop or <span className="browse-text">Browse</span> your
                files
              </p>
              <input type="file" accept="application/pdf" className="file-input" required />
            </div>
          </div>

          <button type="submit" className="btn-upload">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadNotesModal;
