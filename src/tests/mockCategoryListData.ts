import type {
  ICampaign,
  ICategory,
  IParentCategory,
} from "@/features/category/services/category";

export const mockWomanChildCategoryList: ICategory[] = [
  {
    id: 1,
    name: "Dresses",
    slug: "dresses",
    imageUrl: "/assets/categories/dresses.jpg",
    type: "TOP",
  },
  {
    id: 2,
    name: "Tops",
    slug: "tops",
    imageUrl: "/assets/categories/tops.jpg",
    type: "TOP",
  }
];

export const mockWanChildCategoryList: ICategory[] = [
  {
    id: 1,
    name: "Shirts",
    slug: "shirts",
    imageUrl: "/assets/categories/shirts.jpg",
    type: "TOP",
  },
  {
    id: 2,
    name: "Pants",
    slug: "pants",
    imageUrl: "/assets/categories/pants.jpg",
    type: "Bottom",
  },
];

export const mockWomenCampaigns: ICampaign[] = [
  {
    id: 1,
    title: "Summer Lookbook",
    subTitle: "Breezy styles for the heat",
    linkUrl: "/campaigns/summer",
    imageUrl: "/assets/campaigns/summer-banner.jpg",
  },
  {
    id: 2,
    title: "Clearance Sale",
    subTitle: "Up to 50% off",
    linkUrl: "/campaigns/clearance",
    imageUrl: "/assets/campaigns/clearance-banner.jpg",
  },
];

export const mockMenCampaigns: ICampaign[] = [
  {
    id: 1,
    title: "Summer Lookbook",
    subTitle: "Breezy styles for the heat",
    linkUrl: "/campaigns/summer",
    imageUrl: "/assets/campaigns/summer-banner.jpg",
  }
];

export const mockCategoryList: IParentCategory[] = [
  {
    id: 1,
    parentId: null,
    name: "WOMEN",
    slug: "women",
    imageUrl: "/assets/categories/women-main.jpg",
    type: undefined,
    children: mockWomanChildCategoryList,
    campaigns: mockWomenCampaigns,
  },
  {
    id: 2,
    parentId: null,
    name: "MEN",
    slug: "men",
    imageUrl: "/assets/categories/men-main.jpg",
    type: "PARENT",
    children: mockWanChildCategoryList,
    campaigns: mockMenCampaigns,
  },
];
