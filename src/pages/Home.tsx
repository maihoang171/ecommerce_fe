import { useEffect } from "react";
import { CampaignHeroBanner } from "@/components/Body/CampaignHeroBanner";
import { useCampaignStore } from "@/stores/useCampaignStore";
import { useGetCampaignList } from "@/hooks/useCampaign";

export const Home = () => {
  const { campaignList } = useCampaignStore();
  const { handleGetCampaignList } = useGetCampaignList();

  useEffect(() => {
    handleGetCampaignList();
  }, []);

  if (campaignList.length > 0) {
    return (
      <div className="hero-banner-container">
        {campaignList.map((c) => (
          <div key={c.id}>
            <CampaignHeroBanner campaign={c} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full min-h-[70vh] flex flex-col justify-center items-center bg-base-100">
      <h2 className="text-2xl font-bold">Welcome to XuXi Clothes</h2>
      <p className="text-gray-500 mt-2">
        We are currently updating our catalog. Check back soon!
      </p>
    </div>
  );
};
