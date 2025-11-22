import { create } from "zustand";
import axios from "axios";
import { API_BASE_URL, AUTH_ENDPOINTS } from "../utils/constants";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  error: null,
  isLoading: false,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`,
        {
          username,
          password,
        }
      );
      const token = response.data.accessToken;
      localStorage.setItem("token", token);
      set({ token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Invalid credentials",
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
