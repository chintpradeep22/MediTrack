import NurseLayout from "../layouts/NurseLayout";
import Card from "../components/Card";
import { useToast } from "../components/Toast";
import { useNurseNotifications } from "../context/NurseNotificationContext";

const NurseNotifications = () => {
    const { notifications, setNotifications } = useNurseNotifications();
    const { showToast, ToastContainer } = useToast();

    const handleMarkRead = async (notificationId) => {
        try {
            // Mark as read via API
            await fetch(`/nurse/notifications/${notificationId}/read`, { method: "POST" });

            // Remove the notification locally without refetching everything
            setNotifications((prev) => prev.map((n) =>
                n.id === notificationId ? { ...n, read: true } : n
            ));

            showToast("Notification marked as read", "success");
        } catch (error) {
            console.error("Error marking notification as read:", error);
            showToast("Error marking notification as read", "error");
        }
    };

    return (
        <NurseLayout>
            <ToastContainer />
            <div className="dashboard-container">
                <h1 className="page-title">Notifications</h1>

                <Card>
                    {notifications?.length > 0 ? (
                        <div className="notifications-list">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.read ? "read" : "unread"}`}
                                >
                                    <div className="notification-content">
                                        <p className="notification-message">{notification.message}</p>
                                        <small className="notification-time">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </small>
                                    </div>
                                    {!notification.read && (
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleMarkRead(notification.id)}
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">🔔</div>
                            <div className="empty-state-text">No notifications</div>
                        </div>
                    )}
                </Card>
            </div>
        </NurseLayout>
    );
};

export default NurseNotifications;
