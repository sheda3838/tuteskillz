// src/Pages/Admin/StudentsPage.jsx
import React, { useEffect, useState } from "react";
import AdminTable from "../../layout/AdminTable";
import adminTableConfig from "../../../config/adminTableConfig";
import axios from "axios";
import { arrayBufferToBase64 } from "../../utils/fileHelper";
import { useNavigate } from "react-router-dom";

const StudentsPage = () => {
  axios.defaults.withCredentials = true;
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const handleViewProfile = (userId) => {
    // Navigate to StudentProfile page
    // navigate(`/student-profile/${userId}`);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/admin/allStudents`, { responseType: "json" })
      .then((res) => {
        const processedStudents = res.data.students.map((student) => {
          // Default profile pic
          let profilePic = "/default-avatar.png";

          if (student.profilePhoto?.data) {
            const base64String = arrayBufferToBase64(student.profilePhoto.data);
            profilePic = `data:image/jpeg;base64,${base64String}`;
          }

          return {
            ...student,
            profilePic,
            guardianName: student.guardianName || "-", // fallback
          };
        });

        setStudents(processedStudents);
      })
      .catch((err) => console.error(err));
  }, []);

  const { title, columns } = adminTableConfig.students;

  return (
    <AdminTable
      title={title}
      columns={columns}
      data={students}
      onActionClick={handleViewProfile}
    />
  );
};

export default StudentsPage;
