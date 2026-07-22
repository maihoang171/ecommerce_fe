import { CampaignHeroBanner } from "@/components/Body/CampaignHeroBanner";
import { useGetCampaignList } from "@/hooks/useCampaign";
import { Loading } from "@/components/Body/Loading";
import { ServerError } from "./ServerError";
import type { ICampaign } from "@/services/category";

export const Home = () => {
  const { data: campaigns, isLoading } = useGetCampaignList();
  const campaignList = campaigns as ICampaign[];

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
