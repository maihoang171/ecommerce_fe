import type { ApiResponse } from "@/services/type";
import { axiosClient } from "@/services/axios";
import type { ICampaign } from "@/features/campaign/services/campaign";

export interface ICategory {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  type?: string;
}

export interface IParentCategory extends ICategory {
  children: ICategory[];
  parentId: string | null;
  campaigns: ICampaign[];
}

export const getCategoryListService = async (): Promise<IParentCategory[]> => {
  const res =
    await axiosClient.get<ApiResponse<IParentCategory[]>>("/category");

  const categoryList = res.data.data;
  if (!categoryList) {
    throw new Error("Failed to fetch category list!");
  }

  return categoryList;
};
