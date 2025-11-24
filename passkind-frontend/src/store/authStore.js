import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (user) => set({ user }),
      checkAuth: () => {
        const { token } = get();
        if (token) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },
      // Auto-Lock Settings
      autoLockDuration: 15, // in minutes
      isAutoLockEnabled: true,
      updateAutoLockSettings: (enabled, duration) =>
        set({ isAutoLockEnabled: enabled, autoLockDuration: duration }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
