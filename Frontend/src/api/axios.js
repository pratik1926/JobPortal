// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://localhost:7240/api",
//   withCredentials: true, // 🔥 REQUIRED for refresh token cookie
// });

// // 🔥 Attach token dynamically
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token"); // or context (see below)

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7240/api",
  withCredentials: true,
});

// 🔐 Attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Unauthorized → logging out");

      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (status === 403) {
      console.warn("Forbidden access");
    }

    return Promise.reject(error);
  }
);

export default api;