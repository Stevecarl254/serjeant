import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Log actual final request URL
axiosInstance.interceptors.request.use((config) => {
  console.debug("ACTUAL REQUEST:", (config.baseURL || "") + config.url);
  return config;
});

// Add token to every request automatically
axiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("authToken")
    : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle expired tokens automatically
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
