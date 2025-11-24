import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notifySuccess, notifyError } from "../../utils/toast";
import {authGuard } from "../../utils/authGuard"
import Loading from "../../utils/Loading"

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
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`);

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
      <Loading />
    </div>
  );
}

export default LoggedinHome;
