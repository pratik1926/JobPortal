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

// 👥 USERS
export const getAllUsers = () => api.get("/Admin/users");
export const deleteUser = (id) => api.delete(`/Admin/users/${id}`);

// 💼 JOBS (admin view)
export const getAllJobsAdmin = () =>
  api.get("/Admin/admin/all");