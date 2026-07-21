import { useEffect } from "react";
import { CampaignHeroBanner } from "@/components/Body/CampaignHeroBanner";
import { useCampaignStore } from "@/stores/useCampaignStore";
import { useGetCampaignList } from "@/hooks/useCampaign";
import { Loading } from "@/components/Body/Loading";
import { ServerError } from "./ServerError";

export const Home = () => {
  const { campaignList } = useCampaignStore();
  const { handleGetCampaignList, isLoading } = useGetCampaignList();

  useEffect(() => {
    handleGetCampaignList();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

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

  return <ServerError />;
};
