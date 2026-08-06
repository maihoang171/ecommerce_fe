import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosClient } from "@/services/axios";
import {
  registerService,
  loginService,
  checkAuthSessionService,
  getRefreshTokenService,
  logoutService,
} from "./auth";
import { mockAuthSuccessResponse } from "@/tests/mockResponse";
import { mockUserPayload } from "@/tests/mockUserData";

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
      vi.mocked(axiosClient.post).mockResolvedValueOnce({
        data: mockAuthSuccessResponse,
      });

      const result = await registerService(mockUserPayload);

      expect(axiosClient.post).toHaveBeenCalledWith(
        "/auth/register",
        mockUserPayload,
      );
      expect(result).toEqual(mockAuthSuccessResponse);
    });
  });

  describe("loginService", () => {
    it("should send login payload and return response data", async () => {
      vi.mocked(axiosClient.post).mockResolvedValueOnce({
        data: mockAuthSuccessResponse,
      });

      const result = await loginService(mockUserPayload);

      expect(axiosClient.post).toHaveBeenCalledWith(
        "/auth/login",
        mockUserPayload,
      );
      expect(result).toEqual(mockAuthSuccessResponse);
    });
  });

  describe("checkAuthSessionService", () => {
    it("should fetch current user session data", async () => {
      vi.mocked(axiosClient.get).mockResolvedValueOnce({
        data: mockAuthSuccessResponse,
      });

      const result = await checkAuthSessionService();

      expect(axiosClient.get).toHaveBeenCalledWith("/auth/me");
      expect(result).toEqual(mockAuthSuccessResponse);
    });
  });

  describe("getRefreshTokenService", () => {
    it("should call refresh-token endpoint and return response", async () => {
      vi.mocked(axiosClient.get).mockResolvedValueOnce({
        data: mockAuthSuccessResponse,
      });

      const result = await getRefreshTokenService();

      expect(axiosClient.get).toHaveBeenCalledWith("/auth/refresh-token");
      expect(result).toEqual(mockAuthSuccessResponse);
    });
  });

  describe("logoutService", () => {
    it("should send userId to logout endpoint and return response", async () => {
      const userId = 1;
      const mockResponse = { success: true, data: null };

      vi.mocked(axiosClient.post).mockResolvedValueOnce({ data: mockResponse });

      const result = await logoutService(userId);

      expect(axiosClient.post).toHaveBeenCalledWith("/auth/logout", { userId });
      expect(result).toEqual(mockResponse);
    });
  });
});
