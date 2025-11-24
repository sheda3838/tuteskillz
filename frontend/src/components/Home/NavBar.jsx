import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../styles/Home/NavBar.css";
import UserSession from "../../utils/UserSession";
import { notifySuccess } from "../../utils/toast";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // store session user

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const fetchUser = async () => {
      const s = await UserSession.get(); // returns session info without redirect
      if (s.loggedin) setUser(s.user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`);
      if (res.data.success) {
        setUser(null); // clear session state
        notifySuccess("Logged Out Success")
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      alert("Logout failed!");
    }
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
              {/* <Link
                to="/profile"
                className={`nav-item ${
                  location.pathname === "/profile" ? "active" : ""
                }`}
              >
                My Profile
              </Link> */}
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
