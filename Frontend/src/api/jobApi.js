import api from "./axios"; // ✅ use only this

// ✅ GET provider jobs
export const getMyJobs = () => {
  return api.get("/Job/my-jobs");
};

// ✅ GET all jobs
export const getAllJobs = () => {
  return api.get("/Job");
};

// ✅ APPLY to job
export const applyToJob = (jobId, formData) => {
  return api.post(`/Job/apply/${jobId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ GET applied jobs (FIXED)
export const getMyApplications = () => {
  return api.get("/Job/my-applications"); // 🔥 FIXED
};