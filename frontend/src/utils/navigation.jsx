export const handleViewNavigation = (navigate, row) => {
  if (row.sessionId) navigate(`/session/${row.sessionId}`);
  else if (row.tutorId || row.userId) navigate(`/tutor-profile/${row.userId}`);
  else if (row.studentId) navigate(`/student-profile/${row.studentId}`);
  else if (row.notesId) navigate(`/notes/${row.notesId}`);
  else if (row.adminId || row.userId) navigate(`/admin-profile/${row.userId}`);
  else console.warn("No navigation route found for row:", row);
};
