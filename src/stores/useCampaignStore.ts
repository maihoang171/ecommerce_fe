import type { ICampaign } from "@/services/category";
import { create } from "zustand";

interface CampaignState {
  campaignList: ICampaign[] | [];
  setCampaignList: (campaignList: ICampaign[]) => void;
}

export const useCampaignStore = create<CampaignState>((set) => ({
  campaignList: [],
  setCampaignList: (campaignList) => set({ campaignList }),
}));
