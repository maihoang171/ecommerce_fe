import { getCampaignListService, type ICampaign } from "../services/campaign";
import { useQuery } from "@tanstack/react-query";

export const useGetCampaignList = () => {
  return useQuery<ICampaign[], Error>({
    queryKey: ["campaigns"],
    queryFn: () => getCampaignListService(),
  });
};
