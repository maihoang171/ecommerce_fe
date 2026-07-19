import { axiosClient } from "./axios";
import type { ApiResponse } from "./type";

export interface IProductImage {
  id: string;
  color: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface IProductVariant {
  id: string;
  size: string;
  color: string;
  stockQuantity: number;
  sku: string;
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  categoryId: string;
  discountStartAt?: string;
  discountEndAt?: string;
  images: IProductImage[];
  variants: IProductVariant[];
  relatedProducts: IProduct[];
}

export const getProductListByCategorySlugService = async (
  parentSlug: string,
  childSlug?: string,
) => {
  const url = childSlug
    ? `category/${parentSlug}/${childSlug}`
    : `category/${parentSlug}`;

  const res = await axiosClient.get<ApiResponse<IProduct[]>>(url);

  return res.data;
};

export const getProductService = async (id: string) => {
  const res = await axiosClient.get<ApiResponse<IProduct>>(`product/${id}`);

  return res.data;
};
