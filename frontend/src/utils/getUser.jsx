export function getCurrentUser() {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const student = JSON.parse(localStorage.getItem("student"));
  const tutor = JSON.parse(localStorage.getItem("tutor"));

  if (admin) return { ...admin, role: "admin" };
  if (student) return { ...student, role: "student" };
  if (tutor) return { ...tutor, role: "tutor" };

  return null;
}
