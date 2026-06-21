import type { ApiResponse } from "../services/type";
import { axiosClient } from "../services/axios";

export interface ICategory {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
}

export interface ICampaign {
  id: string;
  title: string;
  subTitle: string;
  imageUrl: string;
  linkUrl: string;
}

export interface IParentCategory extends ICategory {
  children: ICategory[];
  parentId: string | null;
  campaigns: ICampaign[];
}

interface IProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}
interface IProductVariant {
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
  categoryId: number;
  discountStartAt?: string;
  discountEndAt?: string;
  images: IProductImage[];
  variants: IProductVariant[];
}

export const getCategoryListService = async () => {
  const res =
    await axiosClient.get<ApiResponse<IParentCategory[]>>("/category");
  return res.data;
};

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
