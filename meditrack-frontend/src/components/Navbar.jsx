import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/authContext";
import axiosInstance from "../api/axiosInstance";


const Navbar = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast(); // use custom toast

  console.log("Entered")

  const handleLogout = async () => {
    console.log("Entered")
    try {
      console.log("Entered Url")
      const res = await axiosInstance.post("/auth/logout"); // sends session cookie
      console.log("Completed Fetch")
      console.log(res.data)
      setUser(null);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      showToast("Failed to logout. Please try again.", "error");
    }
  };

  return (
    <>
      <div style={{ padding: "10px", background: "#1976d2", color: "white" }}>
        <span>MediTrack</span>
        <button onClick={handleLogout} style={{ float: "right" }}>
          Logout
        </button>
      </div>

      {/* Render Toast Container */}
      <ToastContainer />
    </>
  );
};


export default Navbar;
