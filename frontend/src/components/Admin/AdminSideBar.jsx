// components/AdminSidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaGraduationCap,
  FaUserGraduate,
  FaBookOpen,
  FaClipboardList,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa"; // ✅ Added icons for profile & logout
import "../../styles/Admin/admin.css";
import { notifySuccess } from "../../utils/toast";


const AdminSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", path: "/admin", icon: FaHome },
    { name: "Tutors", path: "/admin/tutors", icon: FaGraduationCap },
    { name: "Students", path: "/admin/students", icon: FaUserGraduate },
    { name: "Sessions", path: "/admin/sessions", icon: FaBookOpen },
    { name: "Notes", path: "/admin/notes", icon: FaClipboardList },
    { name: "Admins", path: "/admin/admins", icon: FaUserShield },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    notifySuccess("Logged Out Successfully");
    navigate("/", { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="logo">
          <img src="/Logo.png" alt="Logo" />
        </div>
      </div>

      {/* Sidebar Menu */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <span className="menu-icon">
                <Icon />
              </span>
              <span className="menu-text">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="sidebar-bottom">
        {/* <NavLink 
          to="/admin/profile" 
          className="menu-item"
        >
          <span className="menu-icon"><FaUserCircle /></span>
          <span className="menu-text">My Profile</span>
        </NavLink> */}

        <button className="menu-item logout-btn" onClick={handleLogout}>
          <span className="menu-icon">
            <FaSignOutAlt />
          </span>
          <span className="menu-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
