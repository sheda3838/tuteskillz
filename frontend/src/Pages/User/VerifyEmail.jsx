import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../../utils/toast";
import "../../styles/Utils/VerifyEmai.css"

function VerifyEmail() {
  axios.defaults.withCredentials = true;
  
  const [status, setStatus] = useState("Verifying your email...");
  const [isSuccess, setIsSuccess] = useState(null); // null = loading, true = success, false = error
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      
      if (!token) {
        setStatus("Invalid verification link");
        setIsSuccess(false);
        notifyError("Invalid verification link");
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/verify-email?token=${token}`);
        setStatus(res.data.message || "Email verified successfully!");
        setIsSuccess(true);
        notifySuccess("Email verified successfully! Please log in.");
        setTimeout(() => navigate("/signin"), 2000);
      } catch (err) {
        console.error(err);
        const errorMessage = err.response?.data?.error || "Verification failed or token expired.";
        setStatus(errorMessage);
        setIsSuccess(false);
        notifyError(errorMessage);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="verify-container">
      <div className="verify-box">
        <img src="/email-verify.png" alt="verify-eamil" />
        <h2 
          className={`verify-title ${
            isSuccess === null ? "" : isSuccess ? "success" : "error"
          }`}
        >
          {status}
        </h2>
        <p className="verify-subtext">
          {isSuccess === true && "Redirecting to login..."}
        </p>
        {isSuccess === null && <div className="verify-loader"></div>}
      </div>
    </div>
  );
}

export default VerifyEmail;