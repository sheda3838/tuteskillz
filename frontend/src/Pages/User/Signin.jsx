import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Utils/auth.css";
import axios from "axios";
import { notifySuccess, notifyError } from "../../utils/toast";
import "../../styles/Utils/formElements.css";
import { motion } from "framer-motion";
import Loading from "../../utils/Loading";

function Signin() {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // <-- show loading component
    try {
      const r = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signin`,
        values,
        { withCredentials: true }
      );

      if (r.data.error) {
        notifyError(r.data.error);
        setLoading(false);
        return;
      }

      if (r.data.success) {
        notifySuccess("Signin successful! 🎉");

        try {
          // Wait for session to be properly set
          const sessionRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/test-session`,
            { withCredentials: true }
          );
          console.log("Session response:", sessionRes.data);

          if (sessionRes.data.loggedin) {
            navigate("/loggedin-home");
          } else {
            notifyError("Session not set yet. Try again.");
          }
        } catch (sessionErr) {
          console.error(
            "Session error:",
            sessionErr.response?.data || sessionErr.message
          );
          notifyError("Session check failed.");
        }
      }
    } catch (err) {
      notifyError(err.message || "Something went wrong!");
    } finally {
      setLoading(false); // hide loading component
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/google/token`,
        {
          token: credentialResponse.credential,
        }
      );
      if (res.data.success) {
        notifySuccess("Signed in with Google successfully! 🚀");
        navigate("/loggedin-home");
      }
    } catch (err) {
      notifyError(err.message || "Google Signin failed!");
    }
  };

  return (
    <>
      {loading && <Loading />}
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* ✅ Only one main container now */}
        <div className="auth-box">
          <img src="/Logo.png" alt="Logo" className="logo" />
          <h1>Signin</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder=" "
                onChange={handleInput}
                value={values.email}
                required
              />
              <label htmlFor="email">Email</label>
            </div>

            <div className="form-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder=" "
                onChange={handleInput}
                value={values.password}
                required
              />
              <label htmlFor="password">Password</label>
            </div>

            <div className="show-password-check">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>

            <button type="submit">Sign In</button>
          </form>

          <div className="google-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => notifyError("Google Signin Failed")}
            />
          </div>

          <div className="bottom-links">
            <span>Don't have an account?</span>
            <Link to="/signup"> Signup </Link>
          </div>
        </div>

        <div className="auth-image">
          <h1>Welcome Back</h1>
          <img src="/signin.png" alt="Signin illustration" />
        </div>
      </motion.div>
    </>
  );
}

export default Signin;
