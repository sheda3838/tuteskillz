import React from "react";
import { arrayBufferToBase64 } from "../../utils/fileHelper";

const ProfileInfo = ({ name, profilePic, status }) => {
  return (
    <div className="profile-info">
      <img
        src={
          profilePic
            ? `data:image/jpeg;base64,${arrayBufferToBase64(profilePic.data)}`
            : "/default-avatar.png"
        }
        alt="Profile"
        className="profile-photo"
      />
      <span className="prof-name">{name}</span>
      {status && <span className={`session-status ${status.toLowerCase()}`}>{status}</span>}
    </div>
  );
};


export default ProfileInfo;
