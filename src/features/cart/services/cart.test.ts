import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosClient } from "@/services/axios";
import { addToCartService, getCartService, syncCartService } from "./cart";
import {
  mockDbCart,
  mockDbCartItemPayload,
  mockLocalCartItems,
} from "@/tests/mockCartData";

vi.mock("@/services/axios", () => ({
  axiosClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe("cart service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

      const result = await addToCartService(mockDbCartItemPayload);

      expect(axiosClient.post).toHaveBeenCalledWith(
        "/cart",
        mockDbCartItemPayload,
      );
      expect(result).toEqual(mockCart);
    });

    it("should throw error when cart data is missing in response", async () => {
      vi.mocked(axiosClient.post).mockResolvedValueOnce({
        data: {
          success: false,
          data: null,
        },
      });

      await expect(addToCartService(mockDbCartItemPayload)).rejects.toThrow(
        "Failed when add item to cart!",
      );
    });
  });

  describe("syncCartService", () => {
    it("should throw error when cart is missing in response", async () => {
      vi.mocked(axiosClient.post).mockResolvedValue({
        data: {
          success: false,
          data: null,
        },
      });

      await expect(syncCartService(mockLocalCartItems)).rejects.toThrow(
        "Failed when sync local cart items with database!",
      );
    });

    it("should receive cart on success", async () => {
      vi.mocked(axiosClient.post).mockResolvedValue({
        data: {
          success: true,
          data: mockDbCart,
        },
      });

      const result = await syncCartService(mockLocalCartItems);

      expect(axiosClient.post).toHaveBeenCalledWith("/cart/sync", {
        cartItems: mockLocalCartItems,
      });
      expect(result).toEqual(mockDbCart);
    });
  });

  describe("getCartService", () => {
    describe("getCartService", () => {
      it("should fetch and return cart data successfully", async () => {
        vi.mocked(axiosClient.get).mockResolvedValueOnce({
          data: {
            success: true,
            data: mockDbCart,
          },
        });

        const result = await getCartService();

        expect(axiosClient.get).toHaveBeenCalledWith("/cart");
        expect(result).toEqual(mockDbCart);
      });

      it("should throw error when cart data is missing in response", async () => {
        vi.mocked(axiosClient.get).mockResolvedValueOnce({
          data: {
            success: false,
            data: null,
          },
        });

        await expect(getCartService()).rejects.toThrow(
          "Failed when getting cart!",
        );
      });
    });
  });
});
