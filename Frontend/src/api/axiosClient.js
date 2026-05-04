// import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: "https://localhost:7240/api"
// });

// // 🔐 Attach token automatically
// axiosClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default axiosClient;

// src/api/axiosClient.js
import axios from "axios";
import toast from "react-hot-toast";

const axiosClient = axios.create({
  baseURL: "https://localhost:7240/api",
});

// 🔥 Attach JWT token automatically
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
// 🔥 GLOBAL ERROR HANDLER (MOST IMPORTANT)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;

    if (message) {
      toast.error(message);
    } else {
      toast.error("Something went wrong");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;