// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { describe, it, vi, beforeEach, expect, afterEach } from "vitest";
import { cleanup, renderHook } from "@testing-library/react";
import {
  useRegisterUser,
  useLogin,
  useSyncAuthSession,
  useLogout,
} from "../hooks/useAuth";
import {
  registerService,
  loginService,
  checkAuthSessionService,
  getRefreshTokenService,
  logoutService,
} from "../services/auth";
import { toast } from "sonner";
import { useAuthStore } from "../stores/useAuthStore";
import type { AxiosError } from "axios";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../services/auth", () => ({
  registerService: vi.fn(),
  loginService: vi.fn(),
  checkAuthSessionService: vi.fn(),
  getRefreshTokenService: vi.fn(),
  logoutService: vi.fn(),
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
    const mockResponse = {
      success: true,
      data: {
        id: "1",
        userName: "user1",
        isAdmin: false,
      },
    };

    mockRegisterService.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRegisterUser());

    await result.current.handleRegisterUser(validInput);

    expect(mockRegisterService).toHaveBeenCalledWith({
      userName: "user1",
      password: "User1234@",
    });

    expect(mockToastSuccess).toHaveBeenCalledWith("Register successfully", {
      position: "bottom-right",
    });
  });

  it("should trigger error toast on failure", async () => {
    const err = new Error("Something went wrong");
    mockRegisterService.mockRejectedValue(err);

    const { result } = renderHook(() => useRegisterUser());

    await result.current.handleRegisterUser(validInput);

    expect(mockToastError).toHaveBeenCalledWith(
      `Register failed: ${err.message}`,
      {
        position: "bottom-right",
      },
    );
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

  const mockUserData = {
    id: "1",
    userName: "user1",
    isAdmin: false,
  };

  it("should throw error if user not found", async () => {
    mockLoginService.mockResolvedValue({
      success: true,
      accessToken: "mockAccessToken",
      data: null,
    });

    const { result } = renderHook(() => useLogin());

    await expect(result.current.handleLogin(validInput)).rejects.toThrow(
      "User not found",
    );
  });

  it("should throw error if access token not found", async () => {
    mockLoginService.mockResolvedValue({
      success: true,
      accessToken: undefined,
      data: mockUserData,
    });

    const { result } = renderHook(() => useLogin());

    await expect(result.current.handleLogin(validInput)).rejects.toThrow(
      "Access token not found",
    );
  });

  it("should sync user data to Zustand store and trigger success toast on success", async () => {
    mockLoginService.mockResolvedValue({
      success: true,
      accessToken: "mockAccessToken",
      data: mockUserData,
    });

    const { result } = renderHook(() => useLogin());

    const returnedUser = await result.current.handleLogin(validInput);

    expect(mockLoginService).toHaveBeenCalledWith(validInput);
    expect(returnedUser).toEqual(mockUserData);
    expect(useAuthStore.getState().user).toEqual(mockUserData);
    expect(useAuthStore.getState().isLoggedIn).toBe(true);
    expect(mockToastSuccess).toHaveBeenCalledWith("Welcome back, user1! ", {
      position: "bottom-right",
    });
  });

  it("should trigger error toast on failure", async () => {
    const err = new Error("Something went wrong");
    mockLoginService.mockRejectedValue(err);

    const { result } = renderHook(() => useLogin());

    await expect(result.current.handleLogin(validInput)).rejects.toThrow();

    expect(mockToastError).toHaveBeenCalledWith(
      `Login failed: ${err.message}`,
      {
        position: "bottom-right",
      },
    );
  });
});

describe("useSyncAuthSession Custom Hook", () => {
  const mockCheckAuthSessionService = vi.mocked(checkAuthSessionService);
  const mockGetRefreshTokenService = vi.mocked(getRefreshTokenService);

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

  it("should throw error if session expired", async () => {
    mockGetRefreshTokenService.mockResolvedValue({
      success: false,
      accessToken: undefined,
      data: null,
    });

    const { result } = renderHook(() => useSyncAuthSession());

    await expect(
      result.current.handleSyncAuthSession(),
    ).resolves.toBeUndefined();
    expect(mockToastError).toHaveBeenCalledWith(
      "Sync session failed: Session expired.",
      {
        position: "bottom-right",
      },
    );
  });

  it("should throw error if accessToken not found", async () => {
    mockGetRefreshTokenService.mockResolvedValue({
      success: true,
      accessToken: undefined,
      data: null,
    });

    const { result } = renderHook(() => useSyncAuthSession());

    await expect(
      result.current.handleSyncAuthSession(),
    ).resolves.toBeUndefined();
    expect(mockToastError).toHaveBeenCalledWith(
      "Sync session failed: Session expired.",
      {
        position: "bottom-right",
      },
    );
  });

  it("should throw error if response is false", async () => {
    mockGetRefreshTokenService.mockResolvedValue({
      success: false,
      accessToken: "mockAccessToken",
      data: null,
    });

    const { result } = renderHook(() => useSyncAuthSession());

    mockCheckAuthSessionService.mockResolvedValue({
      success: false,
      data: null,
    });

    expect(result.current.handleSyncAuthSession()).resolves.toBeUndefined();
  });

  it("should throw error if user not found", async () => {
    mockGetRefreshTokenService.mockResolvedValue({
      success: true,
      accessToken: "mockAccessToken",
      data: null,
    });

    mockCheckAuthSessionService.mockResolvedValue({
      success: true,
      data: null,
    });

    const { result } = renderHook(() => useSyncAuthSession());

    expect(result.current.handleSyncAuthSession()).resolves.toBeUndefined();
  });

  it("should clearAuth and setIsCheckingAuth false on error with status code 401", async () => {
    const mockAxiosErr = {
      isAxiosError: true,
      response: {
        status: 401,
      },
    } as AxiosError;

    mockGetRefreshTokenService.mockRejectedValue(mockAxiosErr);

    const { result } = renderHook(() => useSyncAuthSession());
    expect(result.current.isCheckingAuth).toBe(true);

    await result.current.handleSyncAuthSession();

    expect(useAuthStore.getState().user).toBeNull();
    expect(result.current.isCheckingAuth).toBe(false);
  });

  it("should setAuth on success", async () => {
    const mockGetRefreshToken = {
      success: true,
      accessToken: "mockAccessToken",
      data: null,
    };
    mockGetRefreshTokenService.mockResolvedValue(mockGetRefreshToken);

    const mockUserData = {
      id: "1",
      userName: "user1",
      isAdmin: false,
    };

    mockCheckAuthSessionService.mockResolvedValue({
      success: true,
      data: mockUserData,
    });

    const { result } = renderHook(() => useSyncAuthSession());

    const returnedUser = await result.current.handleSyncAuthSession();

    expect(returnedUser).toBeUndefined();
    expect(useAuthStore.getState().user).toEqual(mockUserData);
  });
});

describe("useLogout Custom Hook", () => {
  const mockLogoutService = vi.mocked(logoutService);

  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  it("should toast session cleared and navigate to homepage '/' when user is not found", async () => {
    useAuthStore.setState({
      user: null,
      isLoggedIn: false,
    });

    const { result } = renderHook(() => useLogout());

    await result.current.handleLogout();

    expect(mockLogoutService).not.toHaveBeenCalled();
    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Session cleared. Logged out",
      {
        position: "bottom-right",
      },
    );
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  const mockUserData = {
    id: "1",
    userName: "user1",
    isAdmin: false,
  };
  it("should toast logout successfully and navigate to homepage '/' on success", async () => {
    useAuthStore.setState({
      user: mockUserData,
      isLoggedIn: true,
    });

    const mockRes = {
      success: true,
      data: null,
    };
    mockLogoutService.mockResolvedValue(mockRes);

    const { result } = renderHook(() => useLogout());

    await result.current.handleLogout();

    expect(mockLogoutService).toHaveBeenCalledWith(mockUserData.id);

    expect(mockToastSuccess).toHaveBeenCalledWith("Logout successfully", {
      position: "bottom-right",
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should toast force logout and navigate to homepage '/' when error occured", async () => {
    useAuthStore.setState({
      user: mockUserData,
      isLoggedIn: true,
    });

    const err = new Error("Something went wrong");
    mockLogoutService.mockRejectedValue(err);

    const { result } = renderHook(() => useLogout());

    await result.current.handleLogout();

    expect(mockToastError).toHaveBeenCalledWith(
      "Server error, forced log out",
      {
        position: "bottom-right",
      },
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
