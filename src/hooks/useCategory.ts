import {
  getCategoryListService,
  getProductListByCategorySlugService,
} from "../services/category";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { toast } from "sonner";
import { extractErrorMsg } from "../utils/error";
import { useProductListStore } from "../stores/useProductStore";

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

      console.log(`Get category list failed: ${errMsg}`);
    }
  };

  return { handleGetCategoryList };
};

export const useGetProductList = () => {
  const { setProductList } = useProductListStore();

  const handleGetProductList = async (
    parentSlug: string,
    childSlug?: string,
  ) => {
    try {
      const res = await getProductListByCategorySlugService(
        parentSlug,
        childSlug,
      );

      const productList = res.data;
      if (!productList) {
        throw Error("Product list not found");
      }

      setProductList(productList);
    } catch (error) {
      const errMsg = extractErrorMsg(error);

      toast.error("Failed to fetch product list: " + errMsg, {
        position: "bottom-right",
      });
    }
  };
  return { handleGetProductList };
};
