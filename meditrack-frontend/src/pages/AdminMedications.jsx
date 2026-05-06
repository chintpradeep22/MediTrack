import AdminLayout from "../layouts/AdminLayout";
import { useEffect, useState } from "react";
import { getMedications, addMedication, getPatients } from "../api/adminApi";
import Card from "../components/Card";
import Modal from "../components/Modal";

const AdminMedications = () => {
  const [medications, setMedications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    medicineName: "",
    dosage: "",
    instructions: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [medsRes, patientsRes] = await Promise.all([
        getMedications(),
        getPatients(),
      ]);
      setMedications(medsRes.data);
      setPatients(patientsRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = async (e) => {
    e.preventDefault();
    try {
      await addMedication(formData.patientId, {
        medicineName: formData.medicineName,
        dosage: formData.dosage,
        instructions: formData.instructions,
      });
      setShowAddModal(false);
      setFormData({ patientId: "", medicineName: "", dosage: "", instructions: "" });
      loadData();
      alert("Medication added successfully!");
    } catch (error) {
      alert("Error adding medication");
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
        <div className="flex justify-between items-center mb-xl">
          <h1 className="page-title mb-0">Manage Medications</h1>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Medication
          </button>
        </div>

        <Card>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Dosage</th>
                  <th>Instructions</th>
                  <th>Patient</th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med) => (
                  <tr key={med.id}>
                    <td>{med.medicineName}</td>
                    <td>{med.dosage}</td>
                    <td>{med.instructions}</td>
                    <td>{med.patient?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Medication"
        >
          <form onSubmit={handleAddMedication}>
            <div className="form-group">
              <label className="form-label">Patient</label>
              <select
                className="form-select"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                required
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Medicine Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.medicineName}
                onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dosage</label>
              <input
                type="text"
                className="form-input"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Instructions</label>
              <textarea
                className="form-textarea"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                required
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Medication
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminMedications;
