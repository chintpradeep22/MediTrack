import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <div
      style={{
        width: "200px",
        background: "#f4f4f4",
        height: "100vh",
        padding: "10px",
      }}
    >
      <h4>{role} Menu</h4>

      {role === "ADMIN" && (
        <>
          <Link to="/admin/">Dashboard</Link><br />
          <Link to="/admin/patients">Patients</Link><br />
          <Link to="/admin/nurses">Nurses</Link><br />
          <Link to="/admin/medications">Medications</Link><br />
          <Link to="/admin/schedules">Schedules</Link><br />
        </>
      )}

      {role === "NURSE" && (
        <>
          <Link to="/nurse">Dashboard</Link><br />
          <Link to="/nurse/schedules">Schedules</Link><br />
        </>
      )}
    </div>
  );
};

export default Sidebar;
