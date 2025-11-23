import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSession from "../../utils/UserSession";
import axios from "axios";
import { notifySuccess, notifyError } from "../../utils/toast";
import {authGuard } from "../../utils/authGuard"

function LoggedinHome() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

 useEffect(() => {
  const validate = async () => {
    const user = await authGuard(navigate);

    if (!user) return;

    // Set name (optional visual)
    setName(user.fullName);

    // ROLE REDIRECT
    if (user.role === "student") navigate("/", { replace: true });
    if (user.role === "tutor") {
      console.log(user.role);
      navigate("/tutor", { replace: true })
    };
    if (user.role === "admin") navigate("/admin", { replace: true });
  };

  validate();
}, []);



  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/logout");

      if (res.data.success) {
        notifySuccess("Logged out successfully!");
        navigate("/signin", { replace: true });
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
