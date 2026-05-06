import { useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../auth/authContext";
import axiosInstance from "../api/axiosInstance";
import "../components/Layout.css";

const AdminLayout = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("Entered")
    try {
      const res = await axiosInstance.post("/auth/logout"); // sends session cookie
      console.log(res.data)
      setUser(null);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      showToast("Failed to logout. Please try again.", "error");
    }
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span>🏥</span>
            <span>MediTrack</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" className="sidebar-nav-item">
            <span>📊</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/nurses" className="sidebar-nav-item">
            <span>👨‍⚕️</span>
            <span>Nurses</span>
          </NavLink>
          <NavLink to="/admin/patients" className="sidebar-nav-item">
            <span>🏥</span>
            <span>Patients</span>
          </NavLink>
          <NavLink to="/admin/medications" className="sidebar-nav-item">
            <span>💊</span>
            <span>Medications</span>
          </NavLink>
          <NavLink to="/admin/schedules" className="sidebar-nav-item">
            <span>📅</span>
            <span>Schedules</span>
          </NavLink>
        </nav>
      </div>

      <div className="main-content">
        <div className="navbar">
          <div></div>
          <div className="navbar-user">
            <div className="user-info">
              <p className="user-name">{user?.username || "Admin"}</p>
              <p className="user-role">Administrator</p>
            </div>
            <button className="btn btn-sm btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
