import { useNavigate, useParams } from "react-router-dom";
import { useCategoryStore } from "../stores/useCategoryStore";
import { CampaignHeroBanner } from "@/components/Body/CampaignHeroBanner";
import { ParentCategoryDetail } from "@/components/Body/ParentCategoryDetail";

export const Category = () => {
  const { parentSlug } = useParams();

  const { categoryList } = useCategoryStore();

  const currentCategory = categoryList.find((c) => c.slug === parentSlug);

  const navigate = useNavigate();

  if (!currentCategory) {
    navigate("/not-found", { replace: true });
    return null;
  }

  return (
    <div>
      <div className="hero-banner-container">
        {currentCategory.campaigns.map((campaign) => (
          <div key={campaign.id}>
            <CampaignHeroBanner campaign={campaign} />
          </div>
        ))}
      </div>
      <ParentCategoryDetail category={currentCategory} />
    </div>
  );
};
