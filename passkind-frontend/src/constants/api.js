export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_OTP: "/auth/verify-email",
  RESEND_OTP: "/auth/resend-otp",
  SECRETS: "/secrets",
  USERS: "/users",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  CHANGE_PASSWORD: "/users/change-password",
};
