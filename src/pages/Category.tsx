import { useNavigate, useParams } from "react-router-dom";
import { CampaignHeroBanner } from "@/components/Body/CampaignHeroBanner";
import { ParentCategoryDetail } from "@/components/Body/ParentCategoryDetail";
import type { IParentCategory } from "@/services/category";
import { useEffect } from "react";
import { ServerError } from "./ServerError";
import { useGetCategoryList } from "@/hooks/useCategory";
import { extractErrorMsg } from "@/utils/error";

export const Category = () => {

  const { parentSlug } = useParams<{ parentSlug?: string }>();
  const {
    data: categoryList = [],
    isPending,
    isError,
    error,
  } = useGetCategoryList();

  const currentCategory = (categoryList as IParentCategory[]).find(
    (c) => c.slug === parentSlug,
  ) as IParentCategory;

  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !currentCategory) {
      navigate("/not-found", { replace: true });
    }
  }, [isPending, currentCategory, navigate]);

  if (isError) {
    const msg = extractErrorMsg(error);
    return <ServerError message={msg} />;
  }

  return (
    <div>
      <div className="hero-banner-container">
        {currentCategory?.campaigns?.map((campaign) => (
          <div key={campaign.id}>
            <CampaignHeroBanner campaign={campaign} />
          </div>
        ))}
      </div>
      <ParentCategoryDetail category={currentCategory} />
    </div>
  );
};
