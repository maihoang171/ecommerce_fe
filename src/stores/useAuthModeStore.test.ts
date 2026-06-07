import { describe, it, expect, beforeEach } from "vitest";
import { useAuthModalStore } from "./useAuthModeStore";

describe("useAuthModalStore Zustand Store", () => {
    beforeEach(() => {
        useAuthModalStore.setState({ authMode: null });
    });

    it("should initialize with authMode as null", () => {
        expect(useAuthModalStore.getState().authMode).toBeNull();
    });

    it("should change authMode to login when openLogin is invoked", () => {
        useAuthModalStore.getState().openLogin();
        expect(useAuthModalStore.getState().authMode).toBe("login");
    });

    it("should change authMode to register when openRegister is invoked", () => {
        useAuthModalStore.getState().openRegister();
        expect(useAuthModalStore.getState().authMode).toBe("register");
    });

    it("should reset authMode to null when close is invoked", () => {
        useAuthModalStore.setState({ authMode: "login" });

        useAuthModalStore.getState().close();
        expect(useAuthModalStore.getState().authMode).toBeNull();
    });
});