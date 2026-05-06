import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/authContext";
import axiosInstance from "../api/axiosInstance";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "ADMIN",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!form.username.trim()) {
      setError("Username is required.");
      return false;
    }
    if (!form.password.trim()) {
      setError("Password is required.");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (!["ADMIN", "NURSE"].includes(form.role)) {
      setError("Please select a valid role.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", {
        username: form.username,
        password: form.password,
        role: form.role,
      });

      const user = res.data;

      const userWithRole = {
        ...user,
        role: form.role,
      };

      setUser(userWithRole);

      if (form.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (form.role === "NURSE") {
        navigate("/nurse/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🏨</div>
          <div><h1>MediTrack</h1>
            <p>Nurse Medication Reminder System</p></div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="ADMIN">Admin</option>
              <option value="NURSE">Nurse</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
