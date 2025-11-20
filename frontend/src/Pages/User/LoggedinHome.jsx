import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notifySuccess, notifyError } from "../../utils/toast";

function LoggedinHome() {
  axios.defaults.withCredentials = true;

  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get("/api/user");
        const data = res.data;

        if (!data.loggedin) {
          notifyError(data.message);
          navigate("/signin");
          return;
        }

        // NEW USERS GO TO ROLE SELECTION
        if (data.isNewUser) {
          notifySuccess(data.message);
          navigate("/role-selection");
          return;
        }

        setName(data.fullName);

        // ROLE BASED NAVIGATION
        switch (data.role) {
          case "admin":
            localStorage.setItem(
              "admin",
              JSON.stringify({
                userId: data.userId,
                email: data.email,
                fullName: data.fullName,
                role: data.role,
              })
            );
            navigate("/admin");
            break;

          case "tutor":
            localStorage.setItem(
              "tutor",
              JSON.stringify({
                userId: data.userId,
                email: data.email,
                fullName: data.fullName,
                role: data.role,
              })
            );
            navigate("/tutor");
            break;

          case "student":
            localStorage.setItem(
              "student",
              JSON.stringify({
                userId: data.userId,
                email: data.email,
                fullName: data.fullName,
                role: data.role,
              })
            );
            navigate("/");
            break;
        }
      } catch (err) {
        console.error(err);
        notifyError(err.message || "Error checking user session");
        navigate("/signin");
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/logout");
      if (res.data.success) {
        localStorage.clear(); // <-- Add this
        notifySuccess("Logged out successfully!");
        navigate("/signin");
      }
    } catch (err) {
      notifyError(err.message || "Logout failed!");
    }
  };

  return (
    <div>
      Hello {name}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default LoggedinHome;
