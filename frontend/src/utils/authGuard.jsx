import { notifyError, notifySuccess } from "./toast";
import UserSession from "./UserSession";

export const authGuard = async (navigate) => {
  const session = await UserSession.get();

  // ❌ NOT LOGGED IN → go to signin
  if (!session.loggedin) {
    notifyError(session.message || "Unauthorized");
    navigate("/signin", { replace: true });
    return null;
  }

  // 🟡 NEW USER → go to role selection
  if (session.isNewUser) {
    navigate("/role-selection", { replace: true });
    return null;
  }

  // 🟢 Logged-in user exists?
  const user = session.user;
  if (!user) {
    notifyError("Session invalid. Please sign in again.");
    navigate("/signin", { replace: true });
    return null;
  }

  // Return the user to the caller component
  return user;
};