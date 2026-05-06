import NurseLayout from "../layouts/NurseLayout";
import { useEffect, useState, useContext } from "react";
import {
  getTodaySchedules,
  getUpcomingSchedules,
  getMissedSchedules,
  markGiven,
  markMissed,
} from "../api/nurseApi";
import Card from "../components/Card";
import Badge from "../components/Badge";
import { useToast } from "../components/Toast";
import { useNurseNotifications } from "../context/NurseNotificationContext";
import { AuthContext } from "../auth/authContext";

const NurseSchedules = () => {
  const { user } = useContext(AuthContext);
  const { todaySchedules, setTodaySchedules } = useNurseNotifications(user?.id);
  const [activeTab, setActiveTab] = useState("today");
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastContainer } = useToast();

  // Load schedules initially and whenever activeTab changes
  useEffect(() => {
    loadSchedules();
  }, [activeTab]);

  // Use live todaySchedules from context whenever notifications arrive
  useEffect(() => {
    if (activeTab === "today" && Array.isArray(todaySchedules)) {
      setSchedules([...todaySchedules].reverse());
    }
  }, [todaySchedules, activeTab]);

  const loadSchedules = async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === "today") {
        // fetch todaySchedules from API only if context is empty
        if (!todaySchedules || todaySchedules.length === 0) {
          res = await getTodaySchedules();
          setTodaySchedules(res.data || []);
          setSchedules([...res.data].reverse());
        } else {
          setSchedules([...todaySchedules].reverse());
        }
      } else if (activeTab === "upcoming") {
        res = await getUpcomingSchedules();
        setSchedules(res.data.slice().reverse());
      } else {
        res = await getMissedSchedules();
        setSchedules(res.data.slice().reverse());
      }
    } catch (error) {
      console.error("Error loading schedules:", error);
      showToast("Error loading schedules", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkGiven = async (scheduleId, patientName, medicationName) => {
    if (!window.confirm(`Confirm that medication "${medicationName}" was given to ${patientName}?`)) return;

    try {
      await markGiven(scheduleId);
      // update context if it's today schedule
      if (activeTab === "today") {
        setTodaySchedules((prev) =>
          prev.map((s) => (s.id === scheduleId ? { ...s, status: "GIVEN" } : s))
        );
      }
      setSchedules((prev) =>
        prev.map((s) => (s.id === scheduleId ? { ...s, status: "GIVEN" } : s))
      );
      showToast(`Medication marked as given for ${patientName}`, "success");
    } catch (error) {
      console.error("Error marking medication as given:", error);
      showToast("Error marking medication as given", "error");
    }
  };

  const handleMarkMissed = async (scheduleId, patientName, medicationName) => {
    if (!window.confirm(`Confirm that medication "${medicationName}" was MISSED for ${patientName}?`)) return;

    try {
      await markMissed(scheduleId);
      // update context if it's today schedule
      if (activeTab === "today") {
        setTodaySchedules((prev) =>
          prev.map((s) => (s.id === scheduleId ? { ...s, status: "MISSED" } : s))
        );
      }
      setSchedules((prev) =>
        prev.map((s) => (s.id === scheduleId ? { ...s, status: "MISSED" } : s))
      );
      showToast(`Medication marked as missed for ${patientName}`, "warning");
    } catch (error) {
      console.error("Error marking medication as missed:", error);
      showToast("Error marking medication as missed", "error");
    }
  };

  return (
    <NurseLayout>
      <ToastContainer />
      <div className="dashboard-container">
        <h1 className="page-title">Medication Schedules</h1>

        <div className="tabs mb-lg">
          <button
            className={`tab ${activeTab === "today" ? "active" : ""}`}
            onClick={() => setActiveTab("today")}
          >
            Today's Schedules
          </button>
          <button
            className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`tab ${activeTab === "missed" ? "active" : ""}`}
            onClick={() => setActiveTab("missed")}
          >
            Missed
          </button>
        </div>

        <Card>
          {loading ? (
            <div className="text-center">
              <div className="spinner" style={{ margin: "2rem auto" }}></div>
            </div>
          ) : schedules.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Room</th>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td>{new Date(schedule.scheduledTime).toLocaleString()}</td>
                      <td>{schedule.patient?.name}</td>
                      <td>{schedule.patient?.roomNumber}</td>
                      <td>{schedule.medication?.medicineName}</td>
                      <td>{schedule.medication?.dosage}</td>
                      <td>
                        <Badge status={schedule.status} />
                      </td>
                      <td>
                        {schedule.status === "PENDING" && (
                          <div className="flex gap-sm">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() =>
                                handleMarkGiven(
                                  schedule.id,
                                  schedule.patient?.name,
                                  schedule.medication?.medicineName
                                )
                              }
                            >
                              Mark Given
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() =>
                                handleMarkMissed(
                                  schedule.id,
                                  schedule.patient?.name,
                                  schedule.medication?.medicineName
                                )
                              }
                            >
                              Mark Missed
                            </button>
                          </div>
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
              <div className="empty-state-text">No schedules found</div>
            </div>
          )}
        </Card>
      </div>
    </NurseLayout>
  );
};

export default NurseSchedules;
