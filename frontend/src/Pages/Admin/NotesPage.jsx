// src/Pages/Admin/NotesPage.jsx
import React, { useEffect, useState } from "react";
import AdminTable from "../../layout/AdminTable";
import adminTableConfig from "../../../config/adminTableConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotesPage = () => {
  axios.defaults.withCredentials = true;
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const handleViewNote = (noteId) => {
    // need to make this downloadable for admin
    navigate(`/note-details/${noteId}`);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/admin/allNotes`, { responseType: "json" })
      .then((res) => {
        const processedNotes = res.data.notes.map((n) => ({
          ...n,
          tutorName: n.tutorName || "-",
          uploadedDate: n.uploadedDate || "-",
        }));
        setNotes(processedNotes);
      })
      .catch((err) => console.error(err));
  }, []);

  const { title, columns } = adminTableConfig.notes;

  return (
    <AdminTable
      title={title}
      columns={columns}
      data={notes}
      onActionClick={handleViewNote}
    />
  );
};

export default NotesPage;
