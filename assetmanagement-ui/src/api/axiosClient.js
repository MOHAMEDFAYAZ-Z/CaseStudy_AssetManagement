import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost:7108/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds JWT token to every request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handles 401 unauthorized
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Error message helper - 
export function getErrorMessage(error, fallbackMessage) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.title) {
    return error.response.data.title;
  }
  if (error.message) {
    return error.message;
  }
  return fallbackMessage;
}

export default axiosClient;