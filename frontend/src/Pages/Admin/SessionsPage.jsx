// src/Pages/Admin/SessionsPage.jsx
import React, { useEffect, useState } from "react";
import AdminTable from "../../layout/AdminTable";
import adminTableConfig from "../../../config/adminTableConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {handleViewNavigation} from "../../utils/navigation"

const SessionsPage = () => {
  axios.defaults.withCredentials = true;
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  const handleViewSession = (row) => {
  handleViewNavigation(navigate, row);
};

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/admin/allSessions`, { responseType: "json" })
      .then((res) => {
        const processedSessions = res.data.sessions.map((s) => ({
          ...s,
          tutorName: s.tutorName || "-", // fallback
          studentName: s.studentName || "-",
          status: s.sessionStatus || "-",
        }));

        setSessions(processedSessions);
      })
      .catch((err) => console.error(err));
  }, []);

  const { title, columns } = adminTableConfig.sessions;

  return (
    <AdminTable
      title={title}
      columns={columns}
      data={sessions}
      onActionClick={handleViewSession}
    />
  );
};

export default SessionsPage;
