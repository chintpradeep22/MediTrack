import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // IMPORTANT for session auth
});

export default axiosInstance;