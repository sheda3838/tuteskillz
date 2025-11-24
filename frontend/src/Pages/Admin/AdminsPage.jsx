// src/Pages/Admin/AdminsPage.jsx
import React, { useEffect, useState } from "react";
import AdminTable from "../../layout/AdminTable";
import adminTableConfig from "../../../config/adminTableConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { arrayBufferToBase64 } from "../../utils/fileHelper";

const AdminsPage = () => {
  axios.defaults.withCredentials = true;
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  const handleViewAdmin = (userId) => {
    // Navigate to Admin profile page
    // navigate(`/admin-profile/${userId}`);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/admin/allAdmins`, { responseType: "json" })
      .then((res) => {
        const processedAdmins = res.data.admins.map((a) => {
          let profilePic = "/default-avatar.png";

          if (a.profilePhoto?.data) {
            const base64String = arrayBufferToBase64(a.profilePhoto.data);
            profilePic = `data:image/jpeg;base64,${base64String}`;
          }

          return {
            ...a,
            profilePic,
          };
        });

        setAdmins(processedAdmins);
      })
      .catch((err) => console.error(err));
  }, []);

  const { title, columns } = adminTableConfig.admins;

  return (
    <AdminTable
      title={title}
      columns={columns}
      data={admins}
      onActionClick={handleViewAdmin}
    />
  );
};

export default AdminsPage;
