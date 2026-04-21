import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7240/api",
  withCredentials: true, // 🔥 REQUIRED for refresh token cookie
});

// 🔥 Attach token dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or context (see below)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;