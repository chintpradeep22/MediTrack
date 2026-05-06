import AdminLayout from "../layouts/AdminLayout";
import { useEffect, useState } from "react";
import { getPatients, assignPatientToFloor, getMedicationsByPatient } from "../api/adminApi";
import Card from "../components/Card";
import Modal from "../components/Modal";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showMedicationsModal, setShowMedicationsModal] = useState(false);
  const [floorId, setFloorId] = useState("");
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(res.data);
    } catch (error) {
      console.error("Error loading patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignFloor = async () => {
    try {
      await assignPatientToFloor(selectedPatient.id, floorId);
      setShowAssignModal(false);
      loadPatients();
      alert("Patient assigned to floor successfully!");
    } catch (error) {
      alert("Error assigning patient to floor");
    }
  };

  const viewMedications = async (patient) => {
    try {
      const res = await getMedicationsByPatient(patient.id);
      setMedications(res.data);
      setSelectedPatient(patient);
      setShowMedicationsModal(true);
    } catch (error) {
      alert("Error loading medications");
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
        <h1 className="page-title">Manage Patients</h1>

        <Card>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Room Number</th>
                  <th>Assigned Nurse</th>
                  <th>Floor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.roomNumber}</td>
                    <td>{patient.nurse?.name || "Not Assigned"}</td>
                    <td>{patient.floor?.floorName || "Not Assigned"}</td>
                    <td>
                      <div className="flex gap-sm">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowAssignModal(true);
                          }}
                        >
                          Assign Floor
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => viewMedications(patient)}
                        >
                          View Medications
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
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title="Assign Patient to Floor"
        >
          <div className="form-group">
            <label className="form-label">Floor</label>
            <select
              className="form-select"
              value={floorId}
              onChange={(e) => setFloorId(e.target.value)}
            >
              <option value="">Select Floor</option>
              <option value="1">ICU (Floor 1)</option>
              <option value="2">General Ward (Floor 2)</option>
            </select>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAssignFloor} disabled={!floorId}>
              Assign
            </button>
          </div>
        </Modal>

        <Modal
          isOpen={showMedicationsModal}
          onClose={() => setShowMedicationsModal(false)}
          title={`Medications for ${selectedPatient?.name}`}
        >
          {medications.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((med) => (
                    <tr key={med.id}>
                      <td>{med.medicineName}</td>
                      <td>{med.dosage}</td>
                      <td>{med.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No medications found for this patient</p>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminPatients;
