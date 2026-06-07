import { create } from "zustand";

type AuthMode = "login" | "register" | null;

interface AuthModalState {
    authMode: AuthMode;
    openLogin: () => void;
    openRegister: () => void;
    close: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
    authMode: null,
    openLogin: () => set({ authMode: "login" }),
    openRegister: () => set({ authMode: "register" }),
    close: () => set({ authMode: null }),
}));