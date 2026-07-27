import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosClient } from "../services/axios";
import { getCategoryListService } from "./category";

vi.mock("../services/axios", () => ({
  axiosClient: {
    get: vi.fn(),
  },
}));

describe("category service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCategoryListService", () => {
    it("should fetch and return category list successfully", async () => {
      const mockCategories = [
        {
          id: "1",
          name: "Electronics",
          slug: "electronics",
          imageUrl: "img.png",
          children: [],
          parentId: null,
          campaigns: [],
        },
      ];

      vi.mocked(axiosClient.get).mockResolvedValueOnce({
        data: {
          success: true,
          data: mockCategories,
        },
      });

      const result = await getCategoryListService();

      expect(axiosClient.get).toHaveBeenCalledWith("/category");
      expect(result).toEqual(mockCategories);
    });

    it("should throw error when category list data is missing", async () => {
      vi.mocked(axiosClient.get).mockResolvedValueOnce({
        data: {
          success: false,
          data: null,
        },
      });

      await expect(getCategoryListService()).rejects.toThrow(
        "Failed to fetch category list!"
      );
    });
  });
});