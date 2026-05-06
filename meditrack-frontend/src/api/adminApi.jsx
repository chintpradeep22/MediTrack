import api from "./axiosInstance";

// Nurses
export const getNurses = () => api.get("/admin/nurses");
export const assignNurseToFloor = (nurseId, floorId) =>
  api.put(`/admin/nurses/${nurseId}/assign-floor/${floorId}`);
export const getNursesByFloor = (floorId) =>
  api.get(`/admin/floors/${floorId}/nurses`);

// Patients
export const getPatients = () => api.get("/admin/patients");
export const assignPatientToFloor = (patientId, floorId) =>
  api.put(`/admin/patients/${patientId}/assign-floor/${floorId}`);
export const getPatientsByFloor = (floorId) =>
  api.get(`/admin/floors/${floorId}/patients`);

// Medications
export const getMedications = () => api.get("/admin/medications");
export const addMedication = (patientId, data) =>
  api.post(`/admin/medications/${patientId}`, data);
export const getMedicationsByPatient = (patientId) =>
  api.get(`/admin/patients/${patientId}/medications`);

// Medication Schedules
export const getSchedules = () => api.get("/admin/medication-schedules");
export const createSchedule = (data) =>
  api.post("/admin/medication-schedules", data);
export const updateSchedule = (scheduleId, data) =>
  api.put(`/admin/medication-schedules/${scheduleId}`, data);
export const deleteSchedule = (scheduleId) =>
  api.delete(`/admin/medication-schedules/${scheduleId}`);
