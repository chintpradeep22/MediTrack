// // src/context/NurseNotificationContext.js
// import { createContext, useContext, useState, useEffect } from "react";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";

// const NurseNotificationContext = createContext();

// export const NurseNotificationProvider = ({ nurseId, children }) => {
//     const [notifications, setNotifications] = useState([]);

//     useEffect(() => {
//         if (!nurseId) return;

//         const socket = new SockJS("http://localhost:8080/ws");
//         const stompClient = new Client({
//             webSocketFactory: () => socket,
//             reconnectDelay: 5000,
//         });

//         stompClient.onConnect = () => {
//             console.log("Connected to WebSocket");
//             stompClient.subscribe(`/topic/notifications/${nurseId}`, (message) => {
//                 const newNotification = JSON.parse(message.body);
//                 setNotifications((prev) => [newNotification, ...prev]);
//             });
//         };

//         stompClient.activate();

//         return () => stompClient.deactivate();
//     }, [nurseId]);

//     return (
//         <NurseNotificationContext.Provider value={{ notifications, setNotifications }}>
//             {children}
//         </NurseNotificationContext.Provider>
//     );
// };

// export const useNurseNotifications = () => useContext(NurseNotificationContext);
