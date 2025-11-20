import React from "react";
import "../../styles/TutorProfile/AddressCard.css";

const AddressCard = ({ profile }) => {
  const { address } = profile;

  return (
    <div className="address-card">
      <h3 className="card-title">Address</h3>

      <div className="address-content">
        <div className="address-item">
          <span className="label">Street:</span>
          <span className="value">{address?.street || "N/A"}</span>
        </div>

        <div className="address-item">
          <span className="label">City:</span>
          <span className="value">{address?.city || "N/A"}</span>
        </div>

        <div className="address-item">
          <span className="label">Province:</span>
          <span className="value">{address?.province || "N/A"}</span>
        </div>

        <div className="address-item">
          <span className="label">Postal Code:</span>
          <span className="value">{address?.postalcode || "N/A"}</span>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
