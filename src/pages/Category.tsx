import { useParams } from "react-router-dom";
import { useCategoryStore } from "../stores/useCategoryStore";
import { CampaignHeroBanner } from "@/components/Body/CampaignHeroBanner";

export const Category = () => {
  const { parentSlug, childSlug } = useParams();
  const slug = childSlug || parentSlug;

  const { categoryList } = useCategoryStore();

  const currentCategory = categoryList.find((c) => c.slug === slug);

  return (
    <>
      {currentCategory && (
        <div className="hero-banner-container">
          {currentCategory.campaigns.map((campaign) => (
            <div key={campaign.id}>
              <CampaignHeroBanner campaign={campaign} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
