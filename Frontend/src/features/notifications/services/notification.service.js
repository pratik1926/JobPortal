
import axiosClient from "../../../api/axiosClient";

export const getNotifications = async () => {
  const res = await axiosClient.get("/notification");
  return res.data;
};

export const markAsRead = async (id) => {
  await axiosClient.put(`/notification/read/${id}`);
};

export const markAllAsRead = async () => {
  await axiosClient.put(`/notification/read-all`);
};