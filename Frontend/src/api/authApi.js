import api from "./axios";

export const registerUser = (data) => {
  return api.post("/User/register", data);
};

export const loginUser = (data) => {
  return api.post("/User/login", data); // ✅ FIXED
};