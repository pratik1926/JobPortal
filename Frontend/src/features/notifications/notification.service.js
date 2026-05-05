// import axiosClient from "../../api/axiosClient";

// export const getNotifications = async () => {
//   const res = await axiosClient.get("/notification");
//   return res.data;
// };

// export const markAsRead = async (id) => {
//   await axiosClient.put(`/notification/read/${id}`);
// };

// export const markAllAsRead = async () => {
//   await axiosClient.put(`/notification/read-all`);
// };

// import axiosClient from "../../api/axiosClient";

// // const getAuthHeaders = () => ({
// //   Authorization: `Bearer ${localStorage.getItem("token")}`
// // });

// export const getNotifications = async () => {
//   const res = await axiosClient.get("/notification", {
//     headers: getAuthHeaders()
//   });
//   return res.data;
// };

// export const markAsRead = async (id) => {
//   await axiosClient.put(`/notification/read/${id}`, {}, {
//     headers: getAuthHeaders()
//   });
// };

// export const markAllAsRead = async () => {
//   await axiosClient.put(`/notification/read-all`, {}, {
//     headers: getAuthHeaders()
//   });
// };

import axiosClient from "../../api/axiosClient";

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