import { CampaignHeroBanner } from "@/components/Body/CampaignHeroBanner";
import { useGetCampaignList } from "@/hooks/useCampaign";
import { Loading } from "@/components/Body/Loading";
import { ServerError } from "./ServerError";
import type { ICampaign } from "@/services/category";

export const Home = () => {
  const {
    data: campaignList,
    isLoading,
    isError,
    error,
  } = useGetCampaignList();
  const currentCampaignList = campaignList as ICampaign[];

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ServerError message={error.message} />;
  }

  if (currentCampaignList.length > 0) {
    return (
      <div className="hero-banner-container">
        {currentCampaignList.map((c) => (
          <div key={c.id}>
            <CampaignHeroBanner campaign={c} />
          </div>
        ))}
      </div>
    );
  }

  return <ServerError />;
};
