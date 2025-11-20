import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../styles/Home/NavBar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const student = JSON.parse(localStorage.getItem("student"));
  const tutor = JSON.parse(localStorage.getItem("tutor"));

  const role = student?.role || tutor?.role;
  const isLoggedIn = !!role;

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/logout");
      if (res.data.success) {
        localStorage.clear();
        navigate("/signin");
      }
    } catch (err) {
      console.error(err);
      alert("Logout failed!");
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-inner" style={{ padding: "0 2rem" }}>
        {/* Left: Logo */}
        <div className="logo-container" onClick={() => navigate("/")}>
          <img src="/Logo.png" alt="TuteSkillz Logo" className="navbar-logo" />
        </div>

        {/* Centered Nav Links */}
        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          {/* Home always visible */}
          <Link
            to="/"
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>

          {/* Browse Tutors visible only for guests and students */}
          {(!isLoggedIn || student) && (
            <Link
              to="/browse-tutors"
              className={`nav-item ${
                location.pathname === "/browse-tutors" ? "active" : ""
              }`}
            >
              Browse Tutors
            </Link>
          )}

          {/* Student specific links */}
          {student && (
            <>
              <Link
                to="/my-classes"
                className={`nav-item ${
                  location.pathname === "/my-classes" ? "active" : ""
                }`}
              >
                My Sessions
              </Link>
              <Link
                to="/profile"
                className={`nav-item ${
                  location.pathname === "/profile" ? "active" : ""
                }`}
              >
                My Profile
              </Link>
            </>
          )}

          {/* Tutor specific links */}
          {tutor && (
            <>
              <Link
                to="/my-classes"
                className={`nav-item ${
                  location.pathname === "/my-classes" ? "active" : ""
                }`}
              >
                My Sessions
              </Link>
              <Link
                to="/profile"
                className={`nav-item ${
                  location.pathname === "/profile" ? "active" : ""
                }`}
              >
                My Profile
              </Link>
            </>
          )}
        </div>

        {/* Right: Sign In / Logout */}
        <div className="navbar-right">
          {!isLoggedIn && (
            <button className="signin-btn" onClick={() => navigate("/signin")}>
              Sign In
            </button>
          )}
          {(student || tutor) && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

        {/* Hamburger for mobile */}
        <div
          className={`navbar-hamburger ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
