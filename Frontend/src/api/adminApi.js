// import api from "./axios";

// //Get all users
// export const getAllUsers = () => {
//     return api.get("/Admin/users");
// };

// //Delete User
// export const deleteUser = (id) => {
//     return api.delete(`/Admin/users/${id}`);
// };

// //Get all Jobs
// export const getAllJobs = () => {
//     return api.get("/Admin/admin/all");
// }

import api from "./axios";
import axiosClient from "./axiosClient";
// 👥 USERS
// export const getAllUsers = () => api.get("/Admin/users");

export const getAllUsers = (page, pageSize) =>
  api.get(`/Admin/users?page=${page}&pageSize=${pageSize}`);

// export const getAllUsers = (page, pageSize) =>
//   api.get(`/Admin/users?page=${page}&pageSize=${pageSize}`);

export const deleteUser = (id) => api.delete(`/Admin/users/${id}`);
export const unbanUser = (id) => api.put(`/Admin/unban/${id}`);

export const banUser = (id) => api.put(`/Admin/ban/${id}`);

// 💼 JOBS (admin view)
// export const getAllJobsAdmin = () =>
//   api.get("/Admin/admin/all");

export const getAllJobsAdmin = (page, pageSize) =>
  api.get(`/Admin/admin/all?page=${page}&pageSize=${pageSize}`);

export const getAnalytics = () => 
  api.get("/Admin/analytics");

export const getAllReports = () =>
  axiosClient.get("/report");

export const reviewReport = (id, payload) =>
  axiosClient.patch(`/report/${id}/review`, payload);

export const rejectReport = (id, payload) =>
  axiosClient.patch(`/report/${id}/reject`, payload);

export const resolveReport = (id, payload) =>
  axiosClient.patch(`/report/${id}/resolve`, payload);