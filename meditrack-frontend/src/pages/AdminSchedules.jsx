import AdminLayout from "../layouts/AdminLayout";
import { useEffect, useState } from "react";
import { getSchedules, createSchedule, updateSchedule, deleteSchedule, getMedications, getNurses, getPatients } from "../api/adminApi";
import Card from "../components/Card";
import Modal from "../components/Modal";
import Badge from "../components/Badge";

const AdminSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [medications, setMedications] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    scheduledTime: "",
    status: "PENDING",
    medicationId: "",
    nurseId: "",
    patientId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [schedulesRes, medsRes, nursesRes, patientsRes] = await Promise.all([
        getSchedules(),
        getMedications(),
        getNurses(),
        getPatients(),
      ]);
      setSchedules(schedulesRes.data.slice().reverse());
      setMedications(medsRes.data);
      setNurses(nursesRes.data);
      setPatients(patientsRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateSchedule(formData.id, formData);
        alert("Schedule updated successfully!");
      } else {
        await createSchedule(formData);
        alert("Schedule created successfully!");
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      alert("Error saving schedule");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await deleteSchedule(id);
        loadData();
        alert("Schedule deleted successfully!");
      } catch (error) {
        alert("Error deleting schedule");
      }
    }
  };

  const handleEdit = (schedule) => {
    setFormData({
      id: schedule.id,
      scheduledTime: schedule.scheduledTime.slice(0, 16),
      status: schedule.status,
      medicationId: schedule.medication.id,
      nurseId: schedule.nurse.id,
      patientId: schedule.patient.id,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      scheduledTime: "",
      status: "PENDING",
      medicationId: "",
      nurseId: "",
      patientId: "",
    });
    setEditMode(false);
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
        <div className="flex justify-between items-center mb-xl">
          <h1 className="page-title mb-0">Medication Schedules</h1>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Create Schedule
          </button>
        </div>

        <Card>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Scheduled Time</th>
                  <th>Medication</th>
                  <th>Patient</th>
                  <th>Nurse</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>{new Date(schedule.scheduledTime).toLocaleString()}</td>
                    <td>{schedule.medication?.medicineName}</td>
                    <td>{schedule.patient?.name}</td>
                    <td>{schedule.nurse?.name}</td>
                    <td><Badge status={schedule.status} /></td>
                    <td>
                      <div className="flex gap-sm">
                        <button className="btn btn-sm btn-primary" onClick={() => handleEdit(schedule)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(schedule.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal
          isOpen={showModal}
          onClose={() => { setShowModal(false); resetForm(); }}
          title={editMode ? "Edit Schedule" : "Create Schedule"}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Scheduled Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Medication</label>
              <select
                className="form-select"
                value={formData.medicationId}
                onChange={(e) => setFormData({ ...formData, medicationId: e.target.value })}
                required
              >
                <option value="">Select Medication</option>
                {medications.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.medicineName} - {med.patient?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nurse</label>
              <select
                className="form-select"
                value={formData.nurseId}
                onChange={(e) => setFormData({ ...formData, nurseId: e.target.value })}
                required
              >
                <option value="">Select Nurse</option>
                {nurses.map((nurse) => (
                  <option key={nurse.id} value={nurse.id}>
                    {nurse.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Patient</label>
              <select
                className="form-select"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                required
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="PENDING">PENDING</option>
                <option value="GIVEN">GIVEN</option>
                <option value="MISSED">MISSED</option>
              </select>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editMode ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminSchedules;
