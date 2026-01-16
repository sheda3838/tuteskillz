// src/utils/localAuthGuard.js
import { notifyError } from "../utils/toast";

export const localAuthGuard = (navigate) => {
  const raw = localStorage.getItem("user");
  if (!raw) {
    notifyError("Unauthorized");
    navigate("/signin", { replace: true });
    return null;
  }

  let user;
  try {
    user = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse local user:", err);
    localStorage.removeItem("user");
    navigate("/signin", { replace: true });
    return null;
  }

  // NEW USER → redirect to registration
  if (user.isNewUser) {
    navigate("/role-selection", { replace: true });
    return null;
  }

  // If full user info exists, return it
  if (!user.userId || !user.email || !user.role) {
    notifyError("Incomplete user info. Please sign in again.");
    navigate("/signin", { replace: true });
    return null;
  }

  return user; // { userId, email, fullName, role }
};
