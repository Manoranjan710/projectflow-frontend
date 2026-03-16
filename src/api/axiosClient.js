import axios from "axios";
import { toast } from "sonner";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor
axiosClient.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      toast.error("Session expired. Please sign in again.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
