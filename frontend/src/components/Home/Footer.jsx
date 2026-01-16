import React from "react";
import "../../styles/Home/Footer.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaInstagram, FaLinkedin, FaXTwitter, FaFacebook } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Column */}
        <div className="footer-left">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Disclaimer</a>
          <a href="#">Sitemap</a>
          <a href="#">Services</a>
          <a href="#">Calendar</a>
          <a href="#">Zoom</a>
        </div>

        {/* Center Column */}
        <div className="footer-center">
          <div className="logo-container">
            <img src="/Logo.png" alt="Logo" className="footer-logo" /> 
          </div>

          <div className="footer-social">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaXTwitter /></a>
            <a href="#"><FaFacebook /></a>
          </div>
        </div>

        {/* Right Column */}
        <div className="footer-right">
          <h3>Contact Us</h3>
          <p><FaPhone /> +94 11 2786200</p>
          <p><FaEnvelope /> tuteskillz@gmail.com</p>
          <p><FaMapMarkerAlt /> Colombo 7, Sri Lanka</p>
        </div>

      </div>

      <div className="footer-bottom">
        © Copyright 2025 - All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
