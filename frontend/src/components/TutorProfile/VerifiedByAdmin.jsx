import React from "react";
import "../../styles/TutorProfile/VerifiedByAdmin.css";
import { FaUserShield } from "react-icons/fa";

const VerifiedByAdmin = ({ profile }) => {
  return (
    <div className="verified-by-admin">
      <h3>Verified By</h3>

      <div className="verified-admin-box">
        <FaUserShield className="verified-admin-icon" />
        <p>
          {profile.verification?.admin?.fullName || "Unknown Admin"}
          {profile.verification?.admin?.email &&
            ` (${profile.verification.admin.email})`}
        </p>
      </div>
    </div>
  );
};

export default VerifiedByAdmin;
