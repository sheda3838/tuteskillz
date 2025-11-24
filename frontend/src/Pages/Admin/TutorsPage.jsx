// src/Pages/Admin/TutorsPage.jsx
import React, { useEffect, useState } from "react";
import AdminTable from "../../layout/AdminTable";
import adminTableConfig from "../../../config/adminTableConfig";
import axios from "axios";
import { arrayBufferToBase64 } from "../../utils/fileHelper";
import { useNavigate } from "react-router-dom";
import {handleViewNavigation} from "../../utils/navigation"

const TutorsPage = () => {
  axios.defaults.withCredentials = true;
  const [tutors, setTutors] = useState([]);
  const navigate = useNavigate();

  const handleViewProfile = (row) => {
  handleViewNavigation(navigate, row);
};

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/admin/allTutors`, { responseType: "json" })
      .then((res) => {
        const processedTutors = res.data.tutors.map((tutor) => {
          let profilePic = "/default-avatar.png";

          if (tutor.profilePhoto?.data) {
            // Convert MySQL blob to base64 data URL
            const base64String = arrayBufferToBase64(tutor.profilePhoto.data);
            profilePic = `data:image/jpeg;base64,${base64String}`;
          }

          return {
            ...tutor,
            profilePic,
            status: tutor.verificationId
              ? tutor.verificationStatus || "Unknown"
              : "Pending",
          };
        });

        setTutors(processedTutors);
      })
      .catch((err) => notifyError(err));
  }, []);

  const { title, columns } = adminTableConfig.tutors;

  return <AdminTable title={title} columns={columns} data={tutors} onActionClick={handleViewProfile} />;
};

export default TutorsPage;
