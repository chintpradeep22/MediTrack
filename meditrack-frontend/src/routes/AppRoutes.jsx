import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../auth/authContext";

import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import AdminNurses from "../pages/AdminNurses";
import AdminPatients from "../pages/AdminPatients";
import AdminMedications from "../pages/AdminMedications";
import AdminSchedules from "../pages/AdminSchedules";

import NurseDashboard from "../pages/NurseDashboard";
import NurseSchedules from "../pages/NurseSchedules";
import NursePatients from "../pages/NursePatients";
import NurseProfile from "../pages/NurseProfile";
import NurseNotifications from "../pages/NurseNotifications";
import NurseMedications from "../pages/NurseMedications";

import ProtectedRoute from "../auth/ProtectedRoute";
import { NurseNotificationProvider } from "../context/NurseNotificationContext";

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>; // wait until /auth/me finishes

  return (
    <>
      {user?.role === "NURSE" ? (
        <NurseNotificationProvider nurseId={user.id}>
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/nurse/dashboard" replace />}
            />
            <Route
              path="/login"
              element={<Navigate to="/nurse/dashboard" replace />}
            />

            <Route element={<ProtectedRoute />}>
              <Route path="/nurse/dashboard" element={<NurseDashboard />} />
              <Route path="/nurse/schedules" element={<NurseSchedules />} />
              <Route path="/nurse/patients" element={<NursePatients />} />
              <Route path="/nurse/profile" element={<NurseProfile />} />
              <Route
                path="/nurse/notifications"
                element={<NurseNotifications />}
              />
              <Route
                path="/nurse/medications"
                element={<NurseMedications />}
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NurseNotificationProvider>
      ) : (
        <Routes>
          {/* Root redirect for ADMIN or unauthenticated users */}
          <Route
            path="/"
            element={
              user ? (
                user.role === "ADMIN" ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />

          <Route element={<ProtectedRoute />}>
            {user?.role === "ADMIN" && (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/nurses" element={<AdminNurses />} />
                <Route path="/admin/patients" element={<AdminPatients />} />
                <Route path="/admin/medications" element={<AdminMedications />} />
                <Route path="/admin/schedules" element={<AdminSchedules />} />
              </>
            )}
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  );
};

export default AppRoutes;
