import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosClient } from "@/services/axios";
import {
  registerService,
  loginService,
  checkAuthSessionService,
  getRefreshTokenService,
  logoutService,
  type IAuthPayload,
} from "./auth";

vi.mock("@/services/axios", () => ({
  axiosClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("auth services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerService", () => {
    it("should send payload and return response data successfully", async () => {
      const mockPayload: IAuthPayload = {
        username: "testuser",
        password: "password123",
      };
      const mockResponse = { success: true, data: { id: "1", username: "testuser", isAdmin: false } };

      vi.mocked(axiosClient.post).mockResolvedValueOnce({ data: mockResponse });

      const result = await registerService(mockPayload);

      expect(axiosClient.post).toHaveBeenCalledWith("/auth/register", mockPayload);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("loginService", () => {
    it("should send login payload and return response data", async () => {
      const mockPayload: IAuthPayload = {
        username: "testuser",
        password: "password123",
      };
      const mockResponse = { success: true, data: { id: "1", username: "testuser", isAdmin: false } };

      vi.mocked(axiosClient.post).mockResolvedValueOnce({ data: mockResponse });

      const result = await loginService(mockPayload);

      expect(axiosClient.post).toHaveBeenCalledWith("/auth/login", mockPayload);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("checkAuthSessionService", () => {
    it("should fetch current user session data", async () => {
      const mockResponse = { success: true, data: { id: "1", username: "testuser", isAdmin: false } };

      vi.mocked(axiosClient.get).mockResolvedValueOnce({ data: mockResponse });

      const result = await checkAuthSessionService();

      expect(axiosClient.get).toHaveBeenCalledWith("/auth/me");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getRefreshTokenService", () => {
    it("should call refresh-token endpoint and return response", async () => {
      const mockResponse = { success: true, data: { id: "1", username: "testuser", isAdmin: false } };

      vi.mocked(axiosClient.get).mockResolvedValueOnce({ data: mockResponse });

      const result = await getRefreshTokenService();

      expect(axiosClient.get).toHaveBeenCalledWith("/auth/refresh-token");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("logoutService", () => {
    it("should send userId to logout endpoint and return response", async () => {
      const userId = "1";
      const mockResponse = { success: true, data: null };

      vi.mocked(axiosClient.post).mockResolvedValueOnce({ data: mockResponse });

      const result = await logoutService(userId);

      expect(axiosClient.post).toHaveBeenCalledWith("/auth/logout", { userId });
      expect(result).toEqual(mockResponse);
    });
  });
});