import NurseLayout from "../layouts/NurseLayout";
import { useEffect, useState } from "react";
import { markGiven, markMissed, markNotificationRead } from "../api/nurseApi";
import StatsCard from "../components/StatsCard";
import Card from "../components/Card";
import Badge from "../components/Badge";
import { useToast } from "../components/Toast";
import { useNurseNotifications } from "../context/NurseNotificationContext";

const NurseDashboard = () => {
  const { notifications, todaySchedules, setTodaySchedules } = useNurseNotifications();
  const [localNotifications, setLocalNotifications] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, given: 0, missed: 0 });
  const [loading, setLoading] = useState(true);

  const { showToast, ToastContainer } = useToast();

  // Merge new notifications into localNotifications
  useEffect(() => {
    if (notifications) {
      setLocalNotifications((prev) => {
        const newNotifs = notifications.filter((n) => !prev.find((pn) => pn.id === n.id));
        return [...newNotifs, ...prev];
      });
    }
  }, [notifications]);

  // Update stats whenever todaySchedules change
  useEffect(() => {
    if (todaySchedules) {
      updateStats(todaySchedules);
      setLoading(false); // stop loading once data is available
    }
  }, [todaySchedules]);

  const updateStats = (schedules) => {
    setStats({
      total: schedules.length,
      pending: schedules.filter((s) => s.status === "PENDING").length,
      given: schedules.filter((s) => s.status === "GIVEN").length,
      missed: schedules.filter((s) => s.status === "MISSED").length,
    });
  };

  const handleMarkAsGiven = async (scheduleId) => {
    try {
      await markGiven(scheduleId);
      setTodaySchedules((prev) =>
        prev.map((s) => (s.id === scheduleId ? { ...s, status: "GIVEN" } : s))
      );
      showToast("Medication marked as given", "success");
    } catch (error) {
      console.error(error);
      showToast("Error marking medication as given", "error");
    }
  };

  const handleMarkAsMissed = async (scheduleId) => {
    try {
      await markMissed(scheduleId);
      setTodaySchedules((prev) =>
        prev.map((s) => (s.id === scheduleId ? { ...s, status: "MISSED" } : s))
      );
      showToast("Medication marked as missed", "warning");
    } catch (error) {
      console.error(error);
      showToast("Error marking medication as missed", "error");
    }
  };

  const handleMarkNotificationRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      setLocalNotifications((prev) => (prev || []).filter((n) => n.id !== notificationId));
      showToast("Notification marked as read", "success");
    } catch (error) {
      console.error(error);
      showToast("Error marking notification as read", "error");
    }
  };

  if (loading) {
    return (
      <NurseLayout>
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      </NurseLayout>
    );
  }

  return (
    <NurseLayout>
      <ToastContainer />
      <div className="dashboard-container">
        <h1 className="page-title">Nurse Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-4 mb-xl">
          <StatsCard title="Today's Schedules" value={stats.total} icon="📋" variant="primary" />
          <StatsCard title="Pending" value={stats.pending} icon="⏰" variant="warning" />
          <StatsCard title="Given" value={stats.given} icon="✅" variant="success" />
          <StatsCard title="Missed" value={stats.missed} icon="❌" variant="danger" />
        </div>

        <div className="grid grid-cols-2 gap-lg">
          {/* Today's Medication Schedule */}
          <Card title="Today's Medication Schedule">
            {(todaySchedules || []).length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Patient</th>
                      <th>Medication</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(todaySchedules.slice().reverse() || []).map((schedule) => (
                      <tr key={schedule.id}>
                        <td>{new Date(schedule.scheduledTime).toLocaleTimeString()}</td>
                        <td>{schedule.patient?.name}</td>
                        <td>{schedule.medication?.medicineName}</td>
                        <td><Badge status={schedule.status} /></td>
                        <td>
                          {schedule.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleMarkAsGiven(schedule.id)}
                                className="btn btn-sm btn-success mr-sm"
                              >
                                Given
                              </button>
                              <button
                                onClick={() => handleMarkAsMissed(schedule.id)}
                                className="btn btn-sm btn-danger"
                              >
                                Missed
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <div className="empty-state-text">No pending schedules for today</div>
              </div>
            )}
          </Card>

          {/* Pending Notifications */}
          <Card title="Pending Notifications">
            {(localNotifications || []).length > 0 ? (
              <div className="notifications-list">
                {(localNotifications || []).map((notification) => (
                  <div key={notification.id} className="notification-item unread">
                    <div className="notification-content">
                      <p>{notification.message}</p>
                      <small>{new Date(notification.createdAt).toLocaleString()}</small>
                    </div>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleMarkNotificationRead(notification.id)}
                    >
                      Mark as Read
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🔔</div>
                <div className="empty-state-text">No pending notifications</div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </NurseLayout>
  );
};

export default NurseDashboard;
