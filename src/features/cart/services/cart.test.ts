import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosClient } from "@/services/axios";
import { addToCartService, syncCartService, type ICartItem } from "./cart";

vi.mock("@/services/axios", () => ({
  axiosClient: {
    post: vi.fn(),
  },
}));

describe("cart service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPayload: ICartItem = {
    productId: 10,
    color: "Red",
    size: "M",
    quantity: 1,
  };

  describe("addToCartService", () => {
    it("should send payload and return cart data successfully", async () => {
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
      vi.mocked(axiosClient.post).mockResolvedValueOnce({
        data: {
          success: false,
          data: null,
        },
      });

      await expect(addToCartService(mockPayload)).rejects.toThrow(
        "Failed when add item to cart!",
      );
    });
  });

  describe("syncCartService", () => {
    const mockCartItems: ICartItem[] = [
      {
        productId: 10,
        color: "Red",
        size: "M",
        quantity: 1,
      },
      {
        productId: 2,
        color: "Red",
        size: "M",
        quantity: 2,
      },
    ];

    it("should throw error when cart is missing in response", async () => {
      vi.mocked(axiosClient.post).mockResolvedValue({
        data: {
          success: false,
          data: null,
        },
      });

      await expect(syncCartService(mockCartItems)).rejects.toThrow(
        "Failed when sync local cart items with database!",
      );
    });

    it("should receive cart on success", async () => {
      const mockCart = {
        id: 1,
        userId: 1,
        items: [],
      };

      vi.mocked(axiosClient.post).mockResolvedValue({
        data: {
          success: true,
          data: mockCart,
        },
      });

      const result = await syncCartService(mockCartItems);

      expect(axiosClient.post).toHaveBeenCalledWith("/cart/sync", {
        cartItems: mockCartItems,
      });
      expect(result).toEqual(mockCart);
    });
  });
});
