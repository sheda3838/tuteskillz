import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notifyError, notifySuccess } from "../../utils/toast";

export default function SessionGuard() {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await axios.get("/api/user");
        const data = res.data;

        if (!data.loggedin) {
          notifyError(data.message);
          navigate("/signin");
          return;
        }

        if (data.isNewUser) {
          notifySuccess(data.message);
          navigate("/role-selection");
          return;
        }

        const userObj = {
          userId: data.userId,
          email: data.email,
          fullName: data.fullName,
          role: data.role,
        };

        localStorage.setItem(data.role, JSON.stringify(userObj));

        navigate(`/${data.role}`);
      } catch (err) {
        notifyError(err.message || "Session error");
        navigate("/signin");
      }
    };

    check();
  }, []);

  return null;
}
