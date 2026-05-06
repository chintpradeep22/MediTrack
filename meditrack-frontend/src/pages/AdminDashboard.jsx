import AdminLayout from "../layouts/AdminLayout";
import { useEffect, useState } from "react";
import { getPatients, getNurses, getMedications, getSchedules } from "../api/adminApi";
import StatsCard from "../components/StatsCard";
import Card from "../components/Card";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    nurses: 0,
    patients: 0,
    medications: 0,
    pendingSchedules: 0,
  });
  const [recentSchedules, setRecentSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [nursesRes, patientsRes, medicationsRes, schedulesRes] = await Promise.all([
        getNurses(),
        getPatients(),
        getMedications(),
        getSchedules(),
      ]);

      const pendingCount = schedulesRes.data.filter(s => s.status === 'PENDING').length;

      setStats({
        nurses: nursesRes.data.length,
        patients: patientsRes.data.length,
        medications: medicationsRes.data.length,
        pendingSchedules: pendingCount,
      });

      setRecentSchedules(schedulesRes.data.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <h1 className="page-title">Admin Dashboard</h1>

        <div className="grid grid-cols-4 mb-xl">
          <StatsCard
            title="Total Nurses"
            value={stats.nurses}
            icon="👨‍⚕️"
            variant="primary"
          />
          <StatsCard
            title="Total Patients"
            value={stats.patients}
            icon="🏥"
            variant="success"
          />
          <StatsCard
            title="Medications"
            value={stats.medications}
            icon="💊"
            variant="warning"
          />
          <StatsCard
            title="Pending Schedules"
            value={stats.pendingSchedules}
            icon="⏰"
            variant="danger"
          />
        </div>

        <Card title="Recent Medication Schedules">
          {recentSchedules.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Medication</th>
                    <th>Patient</th>
                    <th>Nurse</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSchedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td>{new Date(schedule.scheduledTime).toLocaleString()}</td>
                      <td>{schedule.medication?.medicineName}</td>
                      <td>{schedule.patient?.name}</td>
                      <td>{schedule.nurse?.name}</td>
                      <td>
                        <span className={`badge badge-${schedule.status.toLowerCase()}`}>
                          {schedule.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-text">No schedules found</div>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
