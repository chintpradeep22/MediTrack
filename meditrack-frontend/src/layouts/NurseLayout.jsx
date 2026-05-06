import { useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../auth/authContext";
import axiosInstance from "../api/axiosInstance";
import "../components/Layout.css";
import { useToast } from "../components/Toast"; // <-- import toast

const NurseLayout = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast(); // <-- initialize toast

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("/auth/logout"); // sends session cookie

      setUser(null);
      showToast(res.data || "Logged out successfully", "success"); // <-- show toast
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      showToast("Failed to logout. Please try again.", "error");
    }
  };

  return (
    <div className="layout">
      <ToastContainer /> {/* <-- show toast container */}

      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span>🏥</span>
            <span>MediTrack</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/nurse/dashboard" className="sidebar-nav-item">
            <span>📊</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/nurse/schedules" className="sidebar-nav-item">
            <span>📅</span>
            <span>Schedules</span>
          </NavLink>
          <NavLink to="/nurse/medications" className="sidebar-nav-item">
            <span>💊</span>
            <span>Medications</span>
          </NavLink>
          <NavLink to="/nurse/patients" className="sidebar-nav-item">
            <span>🏥</span>
            <span>Patients</span>
          </NavLink>
          <NavLink to="/nurse/profile" className="sidebar-nav-item">
            <span>👤</span>
            <span>Profile</span>
          </NavLink>
          <NavLink to="/nurse/notifications" className="sidebar-nav-item">
            <span>🔔</span>
            <span>Notifications</span>
          </NavLink>
        </nav>
      </div>

      <div className="main-content">
        <div className="navbar">
          <div></div>
          <div className="navbar-user">
            <div className="user-info">
              <p className="user-name">{user?.name || "Nurse"}</p>
              <p className="user-role">Nurse</p>
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

export default NurseLayout;
