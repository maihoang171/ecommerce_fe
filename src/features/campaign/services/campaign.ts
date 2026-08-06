import { axiosClient } from "@/services/axios";
import type { ApiResponse } from "@/services/type";

export interface ICampaign {
  id: string;
  title: string;
  subTitle: string;
  imageUrl: string;
  linkUrl: string;
}

export const getCampaignListService = async (): Promise<ICampaign[]> => {
  const res = await axiosClient.get<ApiResponse<ICampaign[]>>("/campaign");
  return res.data.data ?? [];
};
