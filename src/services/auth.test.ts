import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerService, loginService, checkAuthSessionService } from "./auth";
import { axiosClient } from "./axios";

vi.mock("./axios", () => ({
    axiosClient: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

describe("Auth Services Actual Implementation", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should call register endpoint correctly", async () => {
        vi.mocked(axiosClient.post).mockResolvedValue({ data: { success: true } });
        const payload = { userName: "test", password: "123" };

        await registerService(payload);
        expect(axiosClient.post).toHaveBeenCalledWith("/auth/register", payload);
    });

    it("should call login endpoint and return data", async () => {
        const mockData = { user: "hoang" };
        vi.mocked(axiosClient.post).mockResolvedValue({ data: mockData });

        const res = await loginService({ userName: "test", password: "123" });
        expect(res).toEqual(mockData);
    });

    it("should call checkAuthSession endpoint and return data", async () => {
        const mockData = { loggedIn: true };
        vi.mocked(axiosClient.get).mockResolvedValue({ data: mockData });

        const res = await checkAuthSessionService();
        expect(res).toEqual(mockData);
    });
});