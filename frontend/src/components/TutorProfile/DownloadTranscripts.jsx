import React from "react";
import { downloadArrayBufferAsFile } from "../../utils/fileHelper";
import "../../styles/TutorProfile/DownloadTranscript.css";
import { FaDownload, FaFilePdf } from "react-icons/fa";

const DownloadTranscripts = ({ profile }) => {
  return (
    <div className="transcript-section">
      <h3 className="transcript-heading">Transcripts</h3>

      <div className="transcript-list">

        <button
          className="transcript-item"
          disabled={!profile.olTranscript}
          onClick={() =>
            downloadArrayBufferAsFile(
              profile.olTranscript.data,
              "OL_Transcript.pdf",
              "application/pdf"
            )
          }
        >
          <FaFilePdf className="transcript-icon" />
          <span>Download O/L Transcript</span>
          <FaDownload className="transcript-download-icon" />
        </button>

        <button
          className="transcript-item"
          disabled={!profile.alTranscript}
          onClick={() =>
            downloadArrayBufferAsFile(
              profile.alTranscript.data,
              "AL_Transcript.pdf",
              "application/pdf"
            )
          }
        >
          <FaFilePdf className="transcript-icon" />
          <span>Download A/L Transcript</span>
          <FaDownload className="transcript-download-icon" />
        </button>

      </div>
    </div>
  );
};

export default DownloadTranscripts;
