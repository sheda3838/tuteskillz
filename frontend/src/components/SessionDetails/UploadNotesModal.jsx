import React, { useState, useEffect } from "react";
import { FaTimes, FaFileUpload } from "react-icons/fa";
import "../../styles/SessionDetails/UploadNotesModal.css";
import { notifyError, notifySuccess } from "../../utils/toast";

function UploadNotesModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setTitle("");
      setFile(null);
      setUploading(false);
      setError("");
      setProgress(0);
    }
  }, [isOpen]);

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
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10; // Increment progress faster since backend is fast
      });
    }, 500);

    try {
      await onSubmit({ title, file });

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        notifySuccess("Upload successful");
        onClose();
      }, 1000);
    } catch (err) {
      clearInterval(progressInterval);
      console.error(err);

      const errMsg = "File upload failed. Please try again.";
      notifyError(errMsg);
      setError(errMsg);
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay upload-notes-modal">
      <div className="upload-modal-container">
        <div className="upload-modal-header">
          <h2>{uploading ? "Uploading..." : "Upload Notes"}</h2>
          {!uploading && <FaTimes className="close-icon" onClick={onClose} />}
        </div>

        {uploading ? (
          <div className="upload-progress-container">
            <div className="progress-bar-wrapper">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="progress-percentage">{progress}%</p>
            <p className="upload-status-text">Uploading your file...</p>
          </div>
        ) : (
          <form className="upload-notes-form" onSubmit={handleSubmit}>
            <div className="form-grp">
              <label>Title</label>
              <input
                type="text"
                className="input-field"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                />
              </div>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="btn-upload">
              Upload
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default UploadNotesModal;
