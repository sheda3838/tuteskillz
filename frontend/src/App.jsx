import React from "react";
import "./index.css";
import { useLocation } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./Pages/User/Signup";
import Signin from "./Pages/User/Signin";
import LoggedinHome from "./Pages/User/LoggedinHome";
import VerifyEmail from "./Pages/User/VerifyEmail";
import { AnimatePresence } from "framer-motion";
import RoleSelection from "./Pages/User/RoleSelection";
import Register from "./Pages/User/Register";
import AdminLayout from "./layout/AdminLayout";
import { getCurrentUser } from "./utils/getUser";

// Admin Pages Imports Here
import AdminHome from "./Pages/Admin/HomePage";
import AdminStudents from "./Pages/Admin/StudentsPage";
import AdminTutors from "./Pages/Admin/TutorsPage";
import AdminSessions from "./Pages/Admin/SessionsPage";
import AdminNotes from "./Pages/Admin/NotesPage";
import AdminAdmins from "./Pages/Admin/AdminsPage";

// Profile
import TutorProfile from "./Pages/Profile/TutorProfile";
import TutorVerification from "./Pages/Admin/TutorVerification";
// import SessionProfile from "./Pages/Profile/SessionProfile";

// Tutor
import TutorHome from "./Pages/Tutor/Home";

// Student
import BrowseTutors from "./Pages/Student/Browsetutors";

// BrowseClasses
import MyClassesPage from "./Pages/MyClassesPage";
import Home from "./Pages/User/Home";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/loggedin-home" element={<LoggedinHome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/student-register" element={<Register />} />
        <Route path="/tutor-register" element={<Register />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="tutors" element={<AdminTutors />} />
          <Route path="sessions" element={<AdminSessions />} />
          <Route path="notes" element={<AdminNotes />} />
          <Route path="admins" element={<AdminAdmins />} />
        </Route>

        <Route path="/tutor-verification/:id" element={<TutorVerification />} />

        <Route path="/tutor-profile/:id" element={<TutorProfile />} />

        <Route path="/tutor" element={<TutorHome />} />
        <Route path="/browse-tutors" element={<BrowseTutors />} />

        {/* Session route to be implemeneted in sprint 2 */}
        {/* <Route
          path="/session/:id"
          element={<SessionProfile userRole={getCurrentUser()?.role} />}
        /> */}

        <Route path="/my-classes" element={<MyClassesPage />} />

      </Routes>
    </AnimatePresence>
  );
}

export default App;
