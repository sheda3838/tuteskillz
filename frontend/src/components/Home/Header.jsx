import React from "react";
import Navbar from "./NavBar";
import "../../styles/Home/Header.css";
import { useNavigate } from "react-router-dom";

const Header = ({ title, subtitle, showImage = true }) => {
  const navigate = useNavigate();
  return (
    <header className="header">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        {/* Text content */}
        <div className="hero-content">
          {title ? (
            title
          ) : (
            <h1>
              Learn, Grow, and Achieve With <span>Expert</span> Guidance
            </h1>
          )}

          {subtitle ? (
            subtitle
          ) : (
            <p>
              Access high-quality courses anytime, anywhere, and take control of
              your learning journey with ease.
            </p>
          )}
        </div>

        {/* Hero Image Container */}
        {showImage && <div className="hero-image-container"></div>}
      </section>
    </header>
  );
};

export default Header;
