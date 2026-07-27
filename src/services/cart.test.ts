import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosClient } from "./axios";
import { addToCartService, type IAddToCartPayLoad } from "./cart";

vi.mock("./axios", () => ({
  axiosClient: {
    post: vi.fn(),
  },
}));

describe("cart service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addToCartService", () => {
    it("should send payload and return cart data successfully", async () => {
      const mockPayload: IAddToCartPayLoad = {
        userId: 1,
        productId: 10,
        color: "Red",
        size: "M",
      };

      const mockCart = {
        id: 1,
        userId: 1,
        items: [],
      };

      vi.mocked(axiosClient.post).mockResolvedValueOnce({
        data: {
          success: true,
          data: mockCart,
        },
      });

      const result = await addToCartService(mockPayload);

      expect(axiosClient.post).toHaveBeenCalledWith("/cart", mockPayload);
      expect(result).toEqual(mockCart);
    });

    it("should throw error when cart data is missing in response", async () => {
      const mockPayload: IAddToCartPayLoad = {
        userId: 1,
        productId: 10,
        color: "Red",
        size: "M",
      };

      vi.mocked(axiosClient.post).mockResolvedValueOnce({
        data: {
          success: false,
          data: null,
        },
      });

      await expect(addToCartService(mockPayload)).rejects.toThrow(
        "Failed when add item to cart!"
      );
    });
  });
});