import { axiosClient } from "../../../services/axios";
import type { ApiResponse } from "../../../services/type";

export interface ICartItem {
  productId: number;
  quantity: number;
  color: string;
  size: string;
}
export interface ICart {
  id: number;
  userId?: number;
  items: ICartItem[];
}

export const addToCartService = async (cartItem: ICartItem): Promise<ICart> => {
  const res = await axiosClient.post<ApiResponse<ICart>>("/cart", cartItem);

  const cart = res.data.data;
  if (!cart) {
    throw new Error("Failed when add item to cart!");
  }

  return cart;
};

export const syncCartService = async (
  cartItems: ICartItem[],
): Promise<ICart> => {
  const res = await axiosClient.post<ApiResponse<ICart>>("/cart/sync", {
    cartItems,
  });

  const cart = res.data.data;
  if (!cart) {
    throw new Error("Failed when sync local cart items with database!");
  }

  return cart;
};
