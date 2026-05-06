import NurseLayout from "../layouts/NurseLayout";
import { useEffect, useState } from "react";
import { getPatients, getPatientMedications } from "../api/nurseApi";
import Card from "../components/Card";
import Modal from "../components/Modal";

const NursePatients = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [medications, setMedications] = useState([]);
    const [showMedicationsModal, setShowMedicationsModal] = useState(false);
    const [loading, setLoading] = useState(true);

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

    const viewMedications = async (patient) => {
        try {
            const res = await getPatientMedications(patient.id);
            setMedications(res.data);
            setSelectedPatient(patient);
            setShowMedicationsModal(true);
        } catch (error) {
            alert("Error loading medications");
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
                <h1 className="page-title">Patients in Your Floor</h1>

                <Card>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Room Number</th>
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
                                        <td>{patient.floor?.floorName}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => viewMedications(patient)}
                                            >
                                                View Medications
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

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
        </NurseLayout>
    );
};

export default NursePatients;
