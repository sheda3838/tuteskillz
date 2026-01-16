import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSidebar from "../components/Admin/AdminSideBar";
import { localAuthGuard } from "../utils/LocalAuthGuard"; // your authGuard utility
import "../styles/Admin/admin.css";
import Loading from "../utils/Loading";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validate = () => {
      const user = localAuthGuard(navigate); // synchronous
      if (!user || user.role !== "admin") {
        navigate("/signin"); // extra safety
        return;
      }
      setCurrentUser(user);
      setLoading(false);
    };
    validate();
  }, [navigate]);

  if (loading) return <Loading />; // show loading until auth completes

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <main className="admin-main-content">
        <Outlet context={{ currentUser }} /> {/* optional: pass currentUser */}
      </main>
    </div>
  );
};

export default AdminLayout;
