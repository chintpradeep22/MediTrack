import NurseLayout from "../layouts/NurseLayout";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/nurseApi";
import Card from "../components/Card";
import { useToast } from "../components/Toast";

const NurseProfile = () => {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
    });
    const [loading, setLoading] = useState(true);
    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await getProfile();
            setProfile(res.data);
            setFormData({
                name: res.data.name,
                phoneNumber: res.data.phoneNumber,
            });
        } catch (error) {
            console.error("Error loading profile:", error);
            showToast("Error loading profile", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            setEditing(false);
            loadProfile();
            showToast("Profile updated successfully!", "success");
        } catch (error) {
            console.error("Error updating profile:", error);
            showToast("Error updating profile", "error");
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
                <h1 className="page-title">My Profile</h1>

                <div style={{ maxWidth: '600px' }}>
                    <Card
                        title="Profile Information"
                        actions={
                            !editing && (
                                <button className="btn btn-sm btn-primary" onClick={() => setEditing(true)}>
                                    Edit Profile
                                </button>
                            )
                        }
                    >
                        {editing ? (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="flex gap-md">
                                    <button type="submit" className="btn btn-primary">
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setEditing(false);
                                            setFormData({
                                                name: profile.name,
                                                phoneNumber: profile.phoneNumber,
                                            });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-info">
                                <div className="profile-field">
                                    <label className="profile-label">Name</label>
                                    <p className="profile-value">{profile?.name}</p>
                                </div>

                                <div className="profile-field">
                                    <label className="profile-label">Employee ID</label>
                                    <p className="profile-value">{profile?.employeeId}</p>
                                </div>

                                <div className="profile-field">
                                    <label className="profile-label">Phone Number</label>
                                    <p className="profile-value">{profile?.phoneNumber}</p>
                                </div>

                                <div className="profile-field">
                                    <label className="profile-label">Assigned Floor</label>
                                    <p className="profile-value">{profile?.floor?.floorName || "Not Assigned"}</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </NurseLayout>
    );
};

export default NurseProfile;
