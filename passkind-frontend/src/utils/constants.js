export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
};
export const API_ENDPOINTS = {
  SECRETS: "/api/secrets",
  USERS: "/api/users",
};
