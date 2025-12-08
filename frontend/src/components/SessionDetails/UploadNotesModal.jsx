import React, { useState } from "react";
import { FaTimes, FaFileUpload } from "react-icons/fa";
import "../../styles/SessionDetails/UploadNotesModal.css";
import { notifyError } from "../../utils/toast";

function UploadNotesModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        notifyError("File size must be less than 5MB.");
        return;
      }
      setError("");
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      setError("Please provide title and PDF file.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      await onSubmit({ title, file });

      setTitle("");
      setFile(null);
      setUploading(false);
      onClose();
    } catch (err) {
      console.error(err);
      notifyError(err.message || "Upload failed");
      setError("Upload failed. Try again.");
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay upload-notes-modal">
      <div className="upload-modal-container">
        <div className="upload-modal-header">
          <h2>Upload Notes</h2>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>

        <form className="upload-notes-form" onSubmit={handleSubmit}>
          <div className="form-grp">
            <label>Title</label>
            <input
              type="text"
              className="input-field"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div className="form-grp">
            <label>File Upload</label>
            <div className="upload-box">
              <FaFileUpload className="upload-icon" />
              {file ? (
                <p className="file-name">{file.name}</p>
              ) : (
                <p>
                  Drag and drop or <span className="browse-text">Browse</span>{" "}
                  your files
                </p>
              )}
              <input
                type="file"
                accept="application/pdf"
                className="file-input"
                required
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-upload" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadNotesModal;
