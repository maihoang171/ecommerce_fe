import { getProductListByCategorySlugService } from "@/services/product";
import { useProductStore } from "../stores/useProductStore";
import { extractErrorMsg } from "@/utils/error";

export const useGetProductList = () => {
  const { setProductList } = useProductStore();

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

      console.error("Failed to fetch product list: " + errMsg);
    }
  };

  return { handleGetProductList };
};
