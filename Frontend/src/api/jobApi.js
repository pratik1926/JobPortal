import api from "./axios"; // ✅ use only this

// ✅ CREATE job
export const createJob = (data) => {
  return api.post("/Job", data);
};

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


export const getApplicationsForProvider = () => {
  return api.get("/Job/applications");
};


export const updateApplicationStatus = (applicationId, status) => {
  return api.put(`/Job/applications/${applicationId}/status`,{ 
    status: status,
  });
};