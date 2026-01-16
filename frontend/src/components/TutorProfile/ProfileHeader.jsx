import React from "react";
import { arrayBufferToBase64 } from "../../utils/fileHelper";
import "../../styles/TutorProfile/ProfileHeader.css";

const ProfileHeader = ({ profile, currentUserRole }) => {
  return (
    <div className="profile-header-wrapper">

      {/* Top Section */}
      <div className="profile-header">

        {/* Left: Profile Photo + Name */}
        <div className="profile-header-left">
          <img
            src={
              profile?.profilePhoto
                ? `data:image/jpeg;base64,${arrayBufferToBase64(
                    profile.profilePhoto.data
                  )}`
                : "/default-avatar.png"
            }
            alt="Profile"
            className="profile-photo"
          />

          <div className="profile-basic-info">
            <h1 className="profile-name">{profile?.fullName}</h1> 
            <p className="profile-bio">{profile?.bio}</p> 
          </div>
        </div>

        {/* Right: Verification Badge */}
        <div className="profile-verification-status">
          <span
            className={`status-badge ${
              profile?.verification?.status?.toLowerCase()
            }`}
          >
            {profile?.verification?.status || "Not Verified"}
          </span>
        </div>
      </div>

    </div>
  );
};

export default ProfileHeader;
