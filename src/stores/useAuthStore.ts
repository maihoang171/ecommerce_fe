import { create } from "zustand";

interface UserProfile {
    id: string;
    userName: string;
}

interface AuthState {
    user: UserProfile | null
    isLoggedIn: boolean
    login: (user: UserProfile) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoggedIn: false,
    login: (user) => set({ user, isLoggedIn: true }),
}))

