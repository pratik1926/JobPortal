import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost:7240/api"
});

// 🔐 Attach token automatically
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;