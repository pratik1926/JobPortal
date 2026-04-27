import api from "./axios";

export const registerUser = (data) => {
  return api.post("/User/register", data);
};

export const loginUser = (data) => {
  return api.post("/User/login", data); // ✅ FIXED
};

export const sendOtp = (email) => {
  return api.post("/Email/send-otp", { email });
};

export const verifyOtp = (email, code) => {
  return api.post("/Email/verify-otp", { email, code });
};