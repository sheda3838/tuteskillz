import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSideBar";
import '../styles/admin.css';

const AdminLayout = () => {
  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <main className="admin-main-content">
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;
