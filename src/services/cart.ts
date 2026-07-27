import { axiosClient } from "./axios";
import type { IProductVariant } from "./product";
import type { ApiResponse } from "./type";

interface IItem {
  id: number;
  quantity: number;
  productVariant: IProductVariant;
}
export interface ICart {
  id: number;
  userId: number;
  items: IItem[];
}

export interface IAddToCartPayLoad {
  userId: number;
  productId: number;
  color: string;
  size: string;
}

export const addToCartService = async (
  payload: IAddToCartPayLoad,
): Promise<ICart> => {
  const res = await axiosClient.post<ApiResponse<ICart>>("/cart", payload);

  const cart = res.data.data;
  if (!cart) {
    throw new Error("Failed when add item to cart!");
  }

  return cart;
};
