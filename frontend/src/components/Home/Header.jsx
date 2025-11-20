import React from "react";
import Navbar from "./NavBar";
import "../../styles/Home/Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const navigateFunction = () => {
    navigate('/signup')
  }
  return (
    <header className="header">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        {/* Text content */}
        <div className="hero-content">
          <h1>
            Learn, Grow, and Achieve With <span>Expert</span> Guidance
          </h1>
          <p>
            Access high-quality courses anytime, anywhere, and take control of your
            learning journey with ease.
          </p>
          <button onClick={navigateFunction} className="hero-btn">Get Started Now</button>
        </div>

        {/* Hero Image Container (background handled in CSS) */}
        <div className="hero-image-container"></div>
      </section>
    </header>
  );
};

export default Header;
