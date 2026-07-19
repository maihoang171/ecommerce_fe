import { axiosClient } from "./axios";
import type { IProductVariant } from "./product";
import type { ApiResponse } from "./type";

interface IItem {
  id: number;
  quantity: number;
  productVariant: IProductVariant;
}
interface ICart {
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

export const addToCartService = async (payload: IAddToCartPayLoad) => {
  const res = await axiosClient.post<ApiResponse<ICart>>("/cart", payload);

  return res.data;
};
