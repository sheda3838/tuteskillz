import React from "react";
import { FaPencilAlt } from "react-icons/fa";
import "../styles/Utils/Loading.css";

function Loading() {
  return (
    <div className="loading-wrapper">
      <div className="pencil-loader">
        <FaPencilAlt className="pencil-icon" />
        <div className="loader-line"></div>
      </div>
      <p>Loading, please wait...</p>
    </div>
  );
}

export default Loading;
