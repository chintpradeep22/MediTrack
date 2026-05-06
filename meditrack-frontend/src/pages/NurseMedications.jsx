import NurseLayout from "../layouts/NurseLayout";
import { useEffect, useState } from "react";
import { getMedications } from "../api/nurseApi";
import Card from "../components/Card";

const NurseMedications = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const res = await getMedications();
      setMedications(res.data);
    } catch (error) {
      console.error("Error loading medications:", error);
    } finally {
      setLoading(false);
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
      <div className="dashboard-container">
        <h1 className="page-title">Available Medications</h1>

        <Card>
          {medications.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Medicine</th>
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
                      <td>{med.patient?.name || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No medications available</p>
            </div>
          )}
        </Card>
      </div>
    </NurseLayout>
  );
};

export default NurseMedications;
