import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import type { ICampaign } from "@/features/category/services/category";

interface CampaignHeroBannerProps {
  campaign: ICampaign;
}

export const CampaignHeroBanner = ({ campaign }: CampaignHeroBannerProps) => {
  return (
    <Link
      key={campaign.id}
      to={campaign.linkUrl}
      className="relative block group"
    >
      <img
        src={campaign.imageUrl}
        alt={campaign.title}
        className="w-full h-120 md:h-[calc(100vh-200px)] object-between object-cover"
      />
      <div className="sticky bottom-0 flex flex-row items-center justify-between mb-5 py-2 group-hover:text-gray-500 transition-colors bg-white">
        <h2>{campaign.subTitle}</h2>
        <ArrowRightIcon className="h-8 w-auto min-h-8  transition-transform duration-300 ease-in-out group-hover:translate-x-1 " />
      </div>
    </Link>
  );
};
