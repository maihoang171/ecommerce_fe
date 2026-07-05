import { getCategoryListService } from "../services/category";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { extractErrorMsg } from "../utils/error";
import { useState } from "react";

export const useGetCategoryList = () => {
  const { setCategoryList } = useCategoryStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetCategoryList = async () => {
    setIsLoading(true);
    try {
      const res = await getCategoryListService();
      const categoryList = res.data;

      if (!categoryList) {
        throw new Error("No category found");
      }

      setCategoryList(categoryList);
    } catch (error) {
      const errMsg = extractErrorMsg(error);

      console.error(`Get category list failed: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleGetCategoryList, isLoading };
};
