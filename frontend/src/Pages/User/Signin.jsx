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
    setLoading(true);

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

        // ✅ Store email in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: values.email,
            timestamp: Date.now(),
          })
        );

        // 🔥 No need to pass email in state anymore
        navigate("/loggedin-home");
        return;
      }
    } catch (err) {
      notifyError(err.message || "Something went wrong!");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/google/token`,
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      if (res.data.success) {
        const email = res.data.email; // <-- ONLY from backend

        localStorage.setItem(
          "user",
          JSON.stringify({
            email,
            timestamp: Date.now(),
          })
        );

        notifySuccess("Signed in with Google successfully! 🚀");
        navigate("/loggedin-home");
      }
    } catch (err) {
      notifyError(err.message || "Google Signin failed!");
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
      )}
    </>
  );
}

export default Signin;
