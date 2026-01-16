import React, { useState } from "react";
import "../../styles/TutorProfile/BankDetailsCard.css";
import { FaUniversity, FaUser, FaHashtag, FaMapMarkerAlt, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const BankDetailsCard = ({ profile }) => {
  if (!profile.bankDetails || profile.bankDetails.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const accounts = profile.bankDetails;

  const handlePrev = () => setCurrentIndex(prev => (prev === 0 ? accounts.length - 1 : prev - 1));
  const handleNext = () => setCurrentIndex(prev => (prev === accounts.length - 1 ? 0 : prev + 1));

  const { bankName, branch, accountNumber, beneficiaryName, isPrimary } = accounts[currentIndex];

  return (
    <div className="bd-card">
      <h3 className="bd-title">
        Bank Details {accounts.length > 1 && `(Account ${currentIndex + 1} of ${accounts.length})`}
      </h3>

      <div className="bd-grid">
        <div className="bd-field">
          <FaUniversity className="bd-icon" />
          <p><strong>Bank:</strong> {bankName} {isPrimary && <span className="primary-label">(Primary)</span>}</p>
        </div>

        <div className="bd-field">
          <FaMapMarkerAlt className="bd-icon" />
          <p><strong>Branch:</strong> {branch}</p>
        </div>

        <div className="bd-field">
          <FaHashtag className="bd-icon" />
          <p><strong>Account No:</strong> {accountNumber}</p>
        </div>

        <div className="bd-field">
          <FaUser className="bd-icon" />
          <p><strong>Beneficiary:</strong> {beneficiaryName}</p>
        </div>
      </div>

      {accounts.length > 1 && (
        <div className="bd-navigation">
          <button className="bd-btn" onClick={handlePrev}><FaArrowLeft /> Previous</button>
          <button className="bd-btn" onClick={handleNext}>Next <FaArrowRight /></button>
        </div>
      )}
    </div>
  );
};

export default BankDetailsCard;
