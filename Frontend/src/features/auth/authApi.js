import api from "../../api/axios";

export const registerUser = (data) => {
    return api.post("/User/register", data)
}

export const loginUser = (data) => {
  return api.post("/User/login", data); // adjust if your endpoint differs
};

export const sendOtp = (email) => {
  return api.post("/Email/send-otp", { email });
};

export const verifyOtp = (email, code) => {
  return api.post("/Email/verify-otp", { email, code });
};

export const forgotPassword = (email) =>
  api.post("/User/forgot-password", { email });

export const resetPassword = (data) =>
  api.post("/User/reset-password", data);