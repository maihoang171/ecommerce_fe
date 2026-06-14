import { Header } from "../components/header";
import { useCategoryListStore } from "../stores/useCategoryStore";
import { Body } from "../components/body";
import { useEffect } from "react";

export const Home = () => {
  const { categoryList, clickedCategoryId, setActiveCategory } =
    useCategoryListStore();

  const currentActiveCategory =
    categoryList.find((c) => c.id === clickedCategoryId) || categoryList[0];

  useEffect(() => {
    setActiveCategory(currentActiveCategory);
  }, [currentActiveCategory, setActiveCategory]);

  if (!currentActiveCategory) {
    return (
      <div className="w-full min-h-screen bg-base-100 flex flex-col">
        <Header />
        <div className="flex-1 w-full bg-base-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-base-100">
      <Header />
      <Body />
    </div>
  );
};
