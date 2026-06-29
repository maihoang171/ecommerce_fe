import { getCampaignListService } from "@/services/campaign";
import { useCampaignStore } from "@/stores/useCampaignStore";
import { extractErrorMsg } from "@/utils/error";

export const useGetCampaignList = () => {
  const { setCampaignList } = useCampaignStore();

  const handleGetCampaignList = async () => {
    try {
      const res = await getCampaignListService();
      const campaignList = res.data || [];

      setCampaignList(campaignList);
    } catch (error) {
      const errMsg = extractErrorMsg(error);

      console.error("Failed to fetch campaign list: " + errMsg);
    }
  };

  return { handleGetCampaignList };
};
