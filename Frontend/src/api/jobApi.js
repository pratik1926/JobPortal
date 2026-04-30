// import api from "./axios"; // ✅ use only this

// // ✅ CREATE job
// export const createJob = (data) => {
//   return api.post("/Job", data);
// };

// // ✅ GET provider jobs
// export const getMyJobs = () => {
//   return api.get("/Job/my-jobs");
// };

// // ✅ GET all jobs
// export const getAllJobs = () => {
//   return api.get("/Job");
// };

// // ✅ APPLY to job
// export const applyToJob = (jobId, formData) => {
//   return api.post(`/Job/apply/${jobId}`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };

// // ✅ GET applied jobs (FIXED)
// export const getMyApplications = () => {
//   return api.get("/Job/my-applications"); // 🔥 FIXED
// };


// export const getApplicationsForProvider = () => {
//   return api.get("/Job/applications");
// };


// export const updateApplicationStatus = (applicationId, status) => {
//   return api.put(`/Job/applications/${applicationId}/status`,{ 
//     status: status,
//   });
// };

// export const deleteJob = async(jobId) => {
//   const res = await api.delete(`/Job/${jobId}`);
//   return res.data;
// }

// export const updateJob = async (id, data) => {
//   const res = await api.put(`/Job/${id}`, data);
//   return res.data;
// };

import api from "./axios";

// 🧑‍💼 Provider
export const createJob = (data) => api.post("/Job", data);
// export const getMyJobs = () => api.get("/Job/my-jobs");

// 🧑‍💼 Provider
export const getMyJobs = (page = 1, pageSize = 5) =>
  api.get(`/Job/my-jobs?page=${page}&pageSize=${pageSize}`);

export const updateJob = (id, data) => api.put(`/Job/${id}`, data);
export const deleteJob = (jobId) => api.delete(`/Job/${jobId}`);

// 🌐 Public
export const getAllJobs = () => api.get("/Job");

// 👤 Seeker
export const applyToJob = (jobId, formData) =>
  api.post(`/Job/apply/${jobId}`, formData);

export const getMyApplications = () =>
  api.get("/Job/my-applications");

// 📥 Provider view applications
// export const getApplicationsForProvider = () =>
//   api.get("/Job/applications");

export const getApplicationsForProvider = (page = 1, pageSize = 5) =>
  api.get(`/Job/applications?page=${page}&pageSize=${pageSize}`);

export const updateApplicationStatus = (applicationId, status) =>
  api.put(`/Job/applications/${applicationId}/status`, {
    status,
  });