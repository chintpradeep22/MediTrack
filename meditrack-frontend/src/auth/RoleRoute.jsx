import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./authContext";

const RoleRoute = ({ role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return user && user.role === role
    ? <Outlet />
    : <Navigate to="/login" />;
};

export default RoleRoute;
