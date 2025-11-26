import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { notifySuccess, notifyError } from "../../utils/toast";
import Loading from "../../utils/Loading";

function LoggedinHome() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // to get email from Signin
  const email = location.state?.email; // email passed from Signin

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchUser = async () => {
      if (!email) {
        notifyError("No email provided! Redirecting to signin...");
        navigate("/signin", { replace: true });
        return;
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/user`,
          { email } // send email in body
        );

        if (!res.data.success) {
          notifyError(res.data.message || "Failed to fetch user!");
          navigate("/signin", { replace: true });
          return;
        }

        const serverUser = res.data.user;

        // ======== SESSION EXPIRY CHECK ========
        const SESSION_EXPIRY = 1000 * 60 * 30; // 30 mins
        const rawLocalUser = localStorage.getItem("user");
        if (rawLocalUser) {
          try {
            const localUser = JSON.parse(rawLocalUser);
            const now = Date.now();

            // expired session
            if (
              !localUser.timestamp ||
              now - localUser.timestamp > SESSION_EXPIRY
            ) {
              localStorage.removeItem("user");
              console.log("Session expired → cleared localStorage");
            }

            // role conflict
            if (localUser.role && localUser.role !== serverUser.role) {
              localStorage.removeItem("user");
              console.log("Role conflict → cleared localStorage");
            }
          } catch {
            localStorage.removeItem("user");
          }
        }

        // ======== NEW USER ========
        if (res.data.isNewUser) {
          notifySuccess("Please complete your registration!");
          localStorage.setItem(
            "user",
            JSON.stringify({ email, isNewUser: true, timestamp: Date.now() })
          );
          navigate("/role-selection", { replace: true });
          return;
        }

        // ======== STORE FULL USER WITH TIMESTAMP ========
        const userWithTimestamp = { ...serverUser, timestamp: Date.now() };
        setUser(userWithTimestamp);
        localStorage.setItem("user", JSON.stringify(userWithTimestamp));

        notifySuccess("Welcome back!");

        // ======== REDIRECT BASED ON ROLE ========
        const role = serverUser.role;
        if (role === "student") navigate("/", { replace: true });
        else if (role === "tutor") navigate("/tutor", { replace: true });
        else if (role === "admin") navigate("/admin", { replace: true });
      } catch (err) {
        notifyError(err.message || "Failed to fetch user info!");
        navigate("/signin", { replace: true });
      }
    };

    fetchUser();
  }, [email, navigate]);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/logout`
      );
      if (res.data.success) {
        localStorage.removeItem("user");
        notifySuccess("Logged out successfully!");
        navigate("/signin", { replace: true });
      }
    } catch (err) {
      notifyError(err.message || "Logout failed!");
    }
  };

  if (!user) return <Loading />;

  return (
    <div>
      <h1>Welcome, {user.fullName}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default LoggedinHome;
