import api from "../../api/axios";

// Create Job
export const createJob = (data) => {
  return api.post("/Job", data);
};