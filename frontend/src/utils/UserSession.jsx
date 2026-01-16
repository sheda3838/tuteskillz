// src/utils/UserSession.js
import axios from "axios";

const UserSession = {
  async get() {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user`, {
        withCredentials: true,
      });
      // standardize shape
      return {
        success: data?.success ?? false,
        loggedin: data?.loggedin ?? false,
        isNewUser: data?.isNewUser ?? false,
        user: data?.user ?? null, // { userId, email, fullName, role } or null
        message: data?.message ?? "",
      };
    } catch (err) {
      // network or 401
      if (err.response && err.response.status === 401) {
        return { success: false, loggedin: false, isNewUser: false, user: null, message: "Unauthorized" };
      }
      console.error("UserSession.get error:", err);
      return { success: false, loggedin: false, isNewUser: false, user: null, message: "Network error" };
    }
  },

  // optional small helper to check role quickly
  async hasRole(...allowedRoles) {
    const s = await this.get();
    if (!s.loggedin || !s.user) return false;
    return allowedRoles.includes(s.user.role);
  },
};

export default UserSession;
