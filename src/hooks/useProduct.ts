import { getProductListByCategorySlugService } from "@/services/product";
import { useProductStore } from "../stores/useProductStore";
import { extractErrorMsg } from "@/utils/error";
import { useState } from "react";

export const useGetProductList = () => {
  const { setProductList } = useProductStore();
  const [isLoading, setIsLoading] = useState(false);
  const handleGetProductList = async (
    parentSlug: string,
    childSlug?: string,
  ) => {
    setIsLoading(true);
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

      console.error("Failed to fetch product list: " + errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleGetProductList, isLoading };
};
