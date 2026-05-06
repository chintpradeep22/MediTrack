import api from "./axiosInstance";

// Profile
export const getProfile = () => api.get("/nurse/profile");
export const updateProfile = (data) => api.put("/nurse/profile", data);

// Patients
export const getPatients = () => api.get("/nurse/patients");
export const getPatientDetails = (patientId) =>
  api.get(`/nurse/patients/${patientId}`);

// Medications
export const getMedications = () => api.get("/nurse/medications");
export const getPatientMedications = (patientId) =>
  api.get(`/nurse/patients/${patientId}/medications`);

// Schedules
export const getTodaySchedules = () => api.get("/nurse/medication-schedules");
export const getUpcomingSchedules = () => api.get("/nurse/medication-schedules/upcoming");
export const getMissedSchedules = () => api.get("/nurse/medication-schedules/missed");
export const markGiven = (scheduleId) =>
  api.put(`/nurse/medication-schedules/${scheduleId}/mark-given`);
export const markMissed = (scheduleId) =>
  api.put(`/nurse/medication-schedules/${scheduleId}/mark-missed`);

// Notifications
export const getNotifications = () => api.get("/nurse/notifications");
export const markNotificationRead = (notificationId) =>
  api.put(`/nurse/notifications/${notificationId}/read`);
