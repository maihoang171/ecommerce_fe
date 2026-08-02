import { create } from "zustand";
import type { IUser } from "../services/auth";

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  setAuth: (user: IUser, accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  clearAuth: () => set({ user: null, accessToken: null }),
}));
