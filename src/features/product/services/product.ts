import { axiosClient } from "@/services/axios";
import type { ApiResponse } from "@/services/type";

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
): Promise<IProduct[]> => {
  const url = childSlug
    ? `category/${parentSlug}/${childSlug}`
    : `category/${parentSlug}`;

  const res = await axiosClient.get<ApiResponse<IProduct[]>>(url);

  const productList = res.data.data;

  if (!productList) {
    throw new Error("Failed to fetch product list!");
  }

  return productList;
};

export const getProductService = async (id: string): Promise<IProduct> => {
  const res = await axiosClient.get<ApiResponse<IProduct>>(`product/${id}`);

  const product = res.data.data;
  if (!product) {
    throw new Error(`Product with ID ${id} not found`);
  }

  return product;
};
