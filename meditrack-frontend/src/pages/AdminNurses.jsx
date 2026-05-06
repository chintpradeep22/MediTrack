import AdminLayout from "../layouts/AdminLayout";
import { useEffect, useState } from "react";
import { getNurses, assignNurseToFloor } from "../api/adminApi";
import Card from "../components/Card";
import Modal from "../components/Modal";

const AdminNurses = () => {
    const [nurses, setNurses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNurse, setSelectedNurse] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [floorId, setFloorId] = useState("");

    useEffect(() => {
        loadNurses();
    }, []);

    const loadNurses = async () => {
        try {
            const res = await getNurses();
            setNurses(res.data);
        } catch (error) {
            console.error("Error loading nurses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignFloor = async () => {
        try {
            await assignNurseToFloor(selectedNurse.id, floorId);
            setShowAssignModal(false);
            loadNurses();
            alert("Nurse assigned to floor successfully!");
        } catch (error) {
            alert("Error assigning nurse to floor");
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
                <h1 className="page-title">Manage Nurses</h1>

                <Card>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Employee ID</th>
                                    <th>Phone</th>
                                    <th>Floor</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nurses.map((nurse) => (
                                    <tr key={nurse.id}>
                                        <td>{nurse.name}</td>
                                        <td>{nurse.employeeId}</td>
                                        <td>{nurse.phoneNumber}</td>
                                        <td>{nurse.floor?.floorName || "Not Assigned"}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => {
                                                    setSelectedNurse(nurse);
                                                    setShowAssignModal(true);
                                                }}
                                            >
                                                Assign Floor
                                            </button>
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
                    title="Assign Nurse to Floor"
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
            </div>
        </AdminLayout>
    );
};

export default AdminNurses;
