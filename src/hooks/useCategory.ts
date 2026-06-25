import {
  getCategoryListService,
} from "../services/category";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { extractErrorMsg } from "../utils/error";

export const useGetCategoryList = () => {
  const { setCategoryList } = useCategoryStore();

  const handleGetCategoryList = async () => {
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
    }
  };

  return { handleGetCategoryList };
};


