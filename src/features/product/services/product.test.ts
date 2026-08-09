import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosClient } from "@/services/axios";
import {
  getProductListByCategorySlugService,
  getProductService,
  searchProductsService,
} from "@/features/product/services/product";
import { mockProducts } from "@/tests/mockProductData";

vi.mock("@/services/axios", () => ({
  axiosClient: {
    get: vi.fn(),
  },
}));

describe("product service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProductListByCategorySlugService", () => {
    const mockParentSlug = "Women";
    const mockChildSlug = "Jeans";

    it("should use url without childSlug and throw error when no products found", async () => {
      const mockUrl = `category/${mockParentSlug}`;
      vi.mocked(axiosClient.get).mockResolvedValueOnce({
        data: { success: false, data: null },
      });

      await expect(
        getProductListByCategorySlugService(mockParentSlug),
      ).rejects.toThrow("Failed to fetch product list!");

      expect(axiosClient.get).toHaveBeenCalledWith(mockUrl);
    });

    it("should use url with child slug and return product list on success", async () => {
      const mockUrl = `category/${mockParentSlug}/${mockChildSlug}`;

      vi.mocked(axiosClient.get).mockResolvedValueOnce({
        data: { success: true, data: mockProducts },
      });

      const result = await getProductListByCategorySlugService(
        mockParentSlug,
        mockChildSlug,
      );

      expect(result).toEqual(mockProducts);
      expect(axiosClient.get).toHaveBeenCalledWith(mockUrl);
    });
  });

  describe("getProductService", () => {
    it("should fetch and return product data successfully when response is valid", async () => {
      vi.mocked(axiosClient.get).mockResolvedValueOnce({
        data: { data: mockProducts[0] },
      });

      const result = await getProductService("1");

      expect(axiosClient.get).toHaveBeenCalledWith("product/1");
      expect(result).toEqual(mockProducts[0]);
    });

    it("should throw an error if the product data is missing in the response", async () => {
      vi.mocked(axiosClient.get).mockResolvedValueOnce({
        data: { data: null },
      });

      await expect(getProductService("999")).rejects.toThrow(
        "Product with ID 999 not found",
      );
    });
  });

  describe("searchProduct", () => {
    it("should return products on success", async () => {
      vi.mocked(axiosClient.get).mockResolvedValueOnce({
        data: { data: mockProducts },
      });

      const res = await searchProductsService("mockQuery");

      expect(res).toEqual(mockProducts);
    });

    it("should fallback empty array when no products found", async () => {
      vi.mocked(axiosClient.get).mockResolvedValueOnce({
        data: { data: null },
      });

      const res = await searchProductsService("mockQuery");

      expect(res).toEqual([]);
    });
  });
});
