import type { ApiResponse } from "../services/type";
import { axiosClient } from "../services/axios";

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  type?: string;
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

export const getCategoryListService = async () => {
  const res =
    await axiosClient.get<ApiResponse<IParentCategory[]>>("/category");
  return res.data;
};
