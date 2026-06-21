import { axiosClient } from "./axios";
import type { ApiResponse } from "./type";

interface ICampaign {
  id: string;
  title: string;
  subTitle: string;
  imageUrl: string;
  linkUrl: string;
}

export const getCampaignListService = async () => {
  const res = await axiosClient.get<ApiResponse<ICampaign[]>>("/campaign");
  return res.data;
};
