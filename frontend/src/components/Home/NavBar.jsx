// src/components/Home/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/Home/NavBar.css";
import { notifySuccess } from "../../utils/toast";
import { localAuthGuard } from "../../utils/LocalAuthGuard";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const u = localAuthGuard(navigate);

    // If user exists
    if (u) {
      // Redirect admins immediately
      if (u.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }
      setUser(u);
    }
    // If no user → don't return, just let user remain null
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    notifySuccess("Logged Out Successfully");
    navigate("/", { replace: true });
  };

  const isLoggedIn = !!user;
  const role = user?.role;

  return (
    <nav className="navbar">
      <div className="navbar-inner" style={{ padding: "0 2rem" }}>
        {/* Logo */}
        <div className="logo-container" onClick={() => navigate("/")}>
          <img src="/Logo.png" alt="TuteSkillz Logo" className="navbar-logo" />
        </div>

        {/* Nav Links */}
        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>

          {/* Browse Tutors: guests & students */}
          {(!isLoggedIn || role === "student") && (
            <Link
              to="/browse-tutors"
              className={`nav-item ${
                location.pathname === "/browse-tutors" ? "active" : ""
              }`}
            >
              Browse Tutors
            </Link>
          )}

          {/* Student Links */}
          {role === "student" && (
            <>
              <Link
                to="/my-classes"
                className={`nav-item ${
                  location.pathname === "/my-classes" ? "active" : ""
                }`}
              >
                My Sessions
              </Link>
            </>
          )}

          {/* Tutor Links */}
          {role === "tutor" && (
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
          {isLoggedIn && (
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
