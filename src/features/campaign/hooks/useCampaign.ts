import { getCampaignListService } from "../services/campaign";
import type { ICampaign } from "@/features/category/services/category";
import { useQuery } from "@tanstack/react-query";

export const useGetCampaignList = () => {
  return useQuery<ICampaign[], Error>({
    queryKey: ["campaigns"],
    queryFn: () => getCampaignListService(),
  });
};
