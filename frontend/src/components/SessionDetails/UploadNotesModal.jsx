import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaFileUpload,
  FaCheckCircle,
  FaShieldAlt,
  FaSpinner,
} from "react-icons/fa";
import "../../styles/SessionDetails/UploadNotesModal.css";
import { notifyError, notifySuccess } from "../../utils/toast";

function UploadNotesModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0); // 0: Uploading, 1: Scanning, 2: Finalizing

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setTitle("");
      setFile(null);
      setUploading(false);
      setError("");
      setProgress(0);
      setCurrentStep(0);
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
    setCurrentStep(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5; // Increment progress
      });
    }, 200);

    // Simulate steps
    const stepTimer1 = setTimeout(() => setCurrentStep(1), 2000); // Switch to Scanning after 2s

    try {
      await onSubmit({ title, file });

      clearInterval(progressInterval);
      clearTimeout(stepTimer1);

      setProgress(100);
      setCurrentStep(2); // Finalizing/Done

      setTimeout(() => {
        notifySuccess("Notes uploaded successfully!");
        onClose();
      }, 1000); // Close after 1s of showing 100%
    } catch (err) {
      clearInterval(progressInterval);
      clearTimeout(stepTimer1);
      console.error(err);

      const errMsg =
        err.response?.data?.message || err.message || "Upload failed";
      notifyError(errMsg);
      setError(errMsg);
      setUploading(false);
    }
  };

  const steps = [
    { label: "Uploading File...", icon: <FaFileUpload /> },
    { label: "Scanning for Viruses...", icon: <FaShieldAlt /> },
    { label: "Finalizing...", icon: <FaCheckCircle /> },
  ];

  return (
    <div className="modal-overlay upload-notes-modal">
      <div className="upload-modal-container">
        <div className="upload-modal-header">
          <h2>{uploading ? "Processing..." : "Upload Notes"}</h2>
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

            <div className="steps-container">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`step-item ${
                    index <= currentStep ? "active" : ""
                  } ${index < currentStep ? "completed" : ""}`}
                >
                  <div className="step-icon">
                    {index < currentStep ? (
                      <FaCheckCircle />
                    ) : index === currentStep ? (
                      <FaSpinner className="spinner" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
              ))}
            </div>
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
