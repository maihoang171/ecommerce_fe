import { getCategoryListService } from "../services/auth";
import { useCategoryListStore } from "./../stores/useCategoryStore";
import { toast } from "sonner";
import { extractErrorMsg } from "../utils/error";

export const useGetCategoryList = () => {
  const handleGetCategoryList = async () => {
    try {
      const res = await getCategoryListService();
      const categoryList = res.data;
      console.log(categoryList);

      if (!categoryList) {
        throw new Error("Category list not found");
      }

      useCategoryListStore.getState().setCategoryList(categoryList);
    } catch (error) {
      const errMsg = extractErrorMsg(error);

      toast.error(`Get category list failed: ${errMsg}`, {
        position: "bottom-right",
      });
    }
  };

  return { handleGetCategoryList };
};
