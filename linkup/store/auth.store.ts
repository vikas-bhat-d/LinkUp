import { create } from "zustand";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;

  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setAuthLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAuthLoading: true,

  setAuth: (user, token) => {
    localStorage.setItem("linkup_token", token);
    set({
      user,
      token,
      isAuthenticated: true,
      isAuthLoading: false,
    });
  },

  clearAuth: () => {
    localStorage.removeItem("linkup_token");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAuthLoading: false,
    });
  },

  setAuthLoading: (loading) => {
    set({ isAuthLoading: loading });
  },
}));

