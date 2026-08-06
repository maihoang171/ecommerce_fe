import type { IProductVariant } from "@/features/product/services/product";
import { axiosClient } from "../../../services/axios";
import type { ApiResponse } from "../../../services/type";

export interface IDbCartItemPayLoad {
  productId: number;
  quantity: number;
  color: string;
  size: string;
}

export interface IDbCart {
  id: number;
  userId?: number;
  items: IDbCartItem[];
}
export interface IDbCartItem {
  id: number;
  quantity: number;
  productVariant: IProductVariant;
}

export const addToCartService = async (
  cartItem: IDbCartItemPayLoad,
): Promise<IDbCart> => {
  const res = await axiosClient.post<ApiResponse<IDbCart>>("/cart", cartItem);

  const cart = res.data.data;
  if (!cart) {
    throw new Error("Failed when add item to cart!");
  }

  return cart;
};

export const syncCartService = async (
  cartItems: IDbCartItemPayLoad[],
): Promise<IDbCart> => {
  const res = await axiosClient.post<ApiResponse<IDbCart>>("/cart/sync", {
    cartItems,
  });

  const cart = res.data.data;
  if (!cart) {
    throw new Error("Failed when sync local cart items with database!");
  }

  return cart;
};

export const getCartService = async (): Promise<IDbCart> => {
  const res = await axiosClient.get<ApiResponse<IDbCart>>("/cart");

  const cart = res.data.data;
  if (!cart) {
    throw new Error("Failed when getting cart!");
  }

  return cart;
};
