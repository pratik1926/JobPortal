import axiosClient from "./axiosClient";

export const createReport = (payload) =>
  axiosClient.post("/report", payload);

export const getMyReports = () => {
  return axiosClient.get("/Report/my");
};