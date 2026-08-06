import { CampaignHeroBanner } from "@/features/campaign/components/CampaignHeroBanner";
import { useGetCampaignList } from "@/features/campaign/hooks/useCampaign";
import { Loading } from "@/components/Loading";
import { ServerError } from "@/pages/ServerError";
import { extractErrorMsg } from "@/utils/error";
import type { ICampaign } from "@/features/campaign/services/campaign";

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
    const msg = extractErrorMsg(error);
    return <ServerError message={msg} />;
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
