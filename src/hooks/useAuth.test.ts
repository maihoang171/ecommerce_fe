// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { describe, it, vi, beforeEach, expect, afterEach } from "vitest";
import { cleanup, renderHook } from "@testing-library/react";
import { useRegisterUser, useLogin, useSyncAuthSession, } from "../hooks/useAuth";
import { registerService, loginService, checkAuthSessionService } from "../services/auth";
import { toast } from "sonner";
import { type AxiosResponse } from "axios";
import { useAuthStore } from "../stores/useAuthStore";

vi.mock("../services/auth", () => ({
    registerService: vi.fn(),
    loginService: vi.fn(),
    checkAuthSessionService: vi.fn(),
}));

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));
const mockToastSuccess = vi.mocked(toast.success);
const mockToastError = vi.mocked(toast.error);

describe("useRegisterUser Custom Hook", () => {
    const mockRegisterService = vi.mocked(registerService);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    const validInput = {
        userName: "user1",
        password: "User1234@",
        confirmPassword: "User1234@",
    };

    it("should strip confirmPassword and call registerService with correct payload on success", async () => {
        mockRegisterService.mockResolvedValue({
            data: { success: true }
        } as AxiosResponse);

        const { result } = renderHook(() => useRegisterUser());



        await result.current.handleRegisterUser(validInput);

        expect(mockRegisterService).toHaveBeenCalledWith({
            userName: "user1",
            password: "User1234@",
        });

        expect(mockToastSuccess).toHaveBeenCalledWith("Register successfully", {
            position: "bottom-left"
        });
    });

    it("should trigger error toast on failure", async () => {
        const err = new Error("Something went wrong");
        mockRegisterService.mockRejectedValue(err);

        const { result } = renderHook(() => useRegisterUser());

        await result.current.handleRegisterUser(validInput);

        expect(mockToastError).toHaveBeenCalledWith(`Register failed: ${err.message}`, {
            position: "bottom-left"
        });
    });

});

describe("useLogin Custom Hook", () => {
    const mockLoginService = vi.mocked(loginService);

    beforeEach(() => {
        vi.clearAllMocks();
        useAuthStore.setState({
            user: null,
            isLoggedIn: false,
        });
    });

    afterEach(() => {
        cleanup();
    });

    const validInput = {
        userName: "user1",
        password: "User1234@",
    };

    it("should sync user data to Zustand store and trigger success toast on success", async () => {
        const mockUserData = {
            id: 1,
            userName: "user1"
        }

        mockLoginService.mockResolvedValue({
            data: mockUserData
        } as AxiosResponse);

        const { result } = renderHook(() => useLogin());

        const returnedUser = await result.current.handleLogin(validInput);

        expect(mockLoginService).toHaveBeenCalledWith(validInput);
        expect(returnedUser).toEqual(mockUserData);
        expect(useAuthStore.getState().user).toEqual(mockUserData);
        expect(useAuthStore.getState().isLoggedIn).toBe(true);
        expect(mockToastSuccess).toHaveBeenCalledWith("Welcome back, user1! ", {
            position: "bottom-left"
        });
    })

    it("should trigger error toast on failure", async () => {
        const err = new Error("Something went wrong");
        mockLoginService.mockRejectedValue(err);

        const { result } = renderHook(() => useLogin());

        await expect(result.current.handleLogin(validInput)).rejects.toThrow();

        expect(mockToastError).toHaveBeenCalledWith(`Login failed: ${err.message}`, {
            position: "bottom-left"
        });
    });
})

describe("useSyncAuthSession Custom Hook", () => {
    const mockCheckAuthSessionService = vi.mocked(checkAuthSessionService);

    beforeEach(() => {
        vi.clearAllMocks()
        useAuthStore.setState({
            user: null,
            isLoggedIn: false,
        })
    });

    afterEach(() => {
        cleanup();
    });

    it("should sync user data to Zustand store on success", async () => {
        const mockUserData = {
            id: 1,
            userName: "user1"
        }

        mockCheckAuthSessionService.mockResolvedValue({
            data: mockUserData
        } as AxiosResponse);

        const { result } = renderHook(() => useSyncAuthSession());

        await result.current.handleSyncAuthSession();

        expect(mockCheckAuthSessionService).toHaveBeenCalled()
        expect(useAuthStore.getState().user).toEqual(mockUserData);
        expect(useAuthStore.getState().isLoggedIn).toBe(true);
    })

    it("should trigger error toast on failure", async () => {
        const err = new Error("Something went wrong");
        mockCheckAuthSessionService.mockRejectedValue(err);

        const { result } = renderHook(() => useSyncAuthSession());

        await result.current.handleSyncAuthSession();

        expect(mockToastError).toHaveBeenCalledWith(`Sync session failed: ${err.message}`, {
            position: "bottom-left"
        });
    });
})