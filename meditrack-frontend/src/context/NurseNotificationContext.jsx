import { createContext, useContext, useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getTodaySchedules, getNotifications } from "../api/nurseApi";

const NurseNotificationContext = createContext();

export const NurseNotificationProvider = ({ nurseId, children }) => {
    const [notifications, setNotifications] = useState(null); // null initially for loading
    const [todaySchedules, setTodaySchedules] = useState(null);

    // Fetch initial schedules + notifications
    useEffect(() => {
        if (!nurseId) return;

        const fetchInitialData = async () => {
            try {
                const [schedulesRes, notificationsRes] = await Promise.all([
                    getTodaySchedules(),
                    getNotifications(),
                ]);
                setTodaySchedules(schedulesRes.data || []);
                setNotifications(notificationsRes.data || []);
            } catch (err) {
                console.error("Error fetching initial data:", err);
                setTodaySchedules([]);
                setNotifications([]);
            }
        };

        fetchInitialData();
    }, [nurseId]);

    // Setup WebSocket for notifications
    useEffect(() => {
        if (!nurseId) return;

        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
        });

        stompClient.onConnect = () => {
            console.log("Connected to WebSocket");

            // Subscribe to notifications
            stompClient.subscribe(`/topic/notifications/${nurseId}`, async (msg) => {
                const newNotification = JSON.parse(msg.body);

                // Add notification to state
                setNotifications((prev) => [newNotification, ...(prev || [])]);

                // ALSO refetch schedules whenever a new notification arrives
                try {
                    const schedulesRes = await getTodaySchedules();
                    setTodaySchedules(schedulesRes.data || []);
                } catch (err) {
                    console.error("Error fetching updated schedules:", err);
                }
            });
        };

        stompClient.activate();

        return () => stompClient.deactivate();
    }, [nurseId]);

    return (
        <NurseNotificationContext.Provider
            value={{ notifications, setNotifications, todaySchedules, setTodaySchedules }}
        >
            {children}
        </NurseNotificationContext.Provider>
    );
};

export const useNurseNotifications = () => useContext(NurseNotificationContext);
