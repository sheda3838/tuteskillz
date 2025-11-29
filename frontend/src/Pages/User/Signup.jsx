import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Utils/auth.css";
import "../../styles/Utils/formElements.css";
import axios from "axios";
import { notifySuccess, notifyError, notifyInfo } from "../../utils/toast";
import { motion } from "framer-motion";

function Signup() {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
    confpassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.email || !values.password || !values.confpassword) {
      notifyError("All fields are required");
      return;
    }

    if (values.password !== values.confpassword) {
      notifyError("Passwords do not match");
      return;
    }

    try {
      const r = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
        email: values.email,
        password: values.password,
      });

      if (r.data.error) return notifyError(r.data.error);
      if (r.data.exists) {
        notifyInfo("Email already exists - Please sign in");
        navigate("/signin");
        return;
      }

      if (r.data.success) {
        notifySuccess(
          "Signup successful! Check your email to verify your account."
        );
        navigate("/signin");
      }
    } catch (err) {
      notifyError(err.message || "Something went wrong!");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/google/token`,
        { token },
        { withCredentials: true }
      );

      if (res.data.success) {
        const email = res.data.email; // <-- take email from backend

        localStorage.setItem(
          "user",
          JSON.stringify({
            email: email,
            timestamp: Date.now(),
          })
        );

        notifySuccess("Signup success!");
        navigate("/loggedin-home");
      }
    } catch (err) {
      notifyError("Google Signup/Login Error: " + err.message);
    }
  };

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="auth-image">
        <h1>Join the TuteSkillz Family</h1>
        {/* ✅ Use relative public path for assets */}
        <img src="/signup.png" alt="Signup illustration" />
      </div>

      <div className="auth-box">
        <img src="/Logo.png" alt="Logo" className="logo" />
        <h1>Register</h1>

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

          <div className="form-group">
            <input
              type={showPassword ? "text" : "password"}
              name="confpassword"
              placeholder=" "
              onChange={handleInput}
              value={values.confpassword}
              required
            />
            <label htmlFor="confpassword">Confirm Password</label>
          </div>

          <div className="show-password-check">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>

          <button type="submit">Sign Up</button>
        </form>

        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => notifyError("Google Signup Failed")}
            text="signup_with"
          />
        </div>

        <div className="bottom-links">
          <span>Already have an account?</span>
          <Link to="/signin">Signin</Link>
        </div>
      </div>
    </motion.div>
  );
}

export default Signup;
