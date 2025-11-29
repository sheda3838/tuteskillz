// src/config/adminTableConfig.js

const adminTableConfig = {
  students: {
    title: "Students",
    columns: [
      { key: "profilePic", label: "Profile Pic" },
      { key: "userId", label: "ID" },
      { key: "fullName", label: "Full Name" },
      { key: "email", label: "Email" },
      { key: "guardianName", label: "Guardian Name" },
      { key: "actions", label: "Actions" },
    ],
  },

  tutors: {
    title: "Tutors",
    columns: [
      { key: "profilePic", label: "Profile Pic" },
      { key: "userId", label: "ID" },
      { key: "fullName", label: "Full Name" },
      { key: "email", label: "Email" },
      { key: "status", label: "Status" },
      { key: "actions", label: "Actions" },
    ],
  },

  sessions: {
    title: "Sessions",
    columns: [
      { key: "sessionId", label: "Session ID" },
      { key: "tutorName", label: "Tutor Name" },
      { key: "studentName", label: "Student Name" },
      { key: "date", label: "Date" },
      { key: "status", label: "Status" },
      { key: "actions", label: "Actions" },
    ],
  },

  notes: {
    title: "Notes",
    columns: [
      { key: "noteId", label: "Notes ID" },
      { key: "sessionId", label: "Session ID" },
      { key: "title", label: "Title" },
      { key: "uploadedDate", label: "Uploaded Date" },
      { key: "tutorName", label: "Tutor Name" },  
      { key: "actions", label: "Actions" },
    ],
  },

  admins: {
    title: "Admins",
    columns: [
      { key: "profilePic", label: "Profile Pic" },
      { key: "userId", label: "ID" },
      { key: "fullName", label: "Full Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "actions", label: "Actions" },
    ],
  },
};

export default adminTableConfig;
