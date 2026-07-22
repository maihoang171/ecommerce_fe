import {
  getProductListByCategorySlugService,
  getProductService,
  type IProduct,
} from "@/services/product";
import { useProductStore } from "../stores/useProductStore";
import { extractErrorMsg } from "@/utils/error";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const useGetProductList = (parentSlug: string, childSlug?: string) => {
  return useQuery<IProduct[], Error>({
    queryKey: ["products", parentSlug, childSlug],
    queryFn: () => getProductListByCategorySlugService(parentSlug, childSlug)
  })
}

export const useGetProduct = () => {
  const { setProduct } = useProductStore();
  const [isLoadingGetProduct, setIsLoadingGetProduct] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const handleGetProduct = async (productId: string) => {
    setIsLoadingGetProduct(true);
    try {
      const res = await getProductService(productId);
      const product = res.data;

      if (!product) {
        throw Error("Product not found");
      }

      setErrMsg(null);
      setProduct(product);
      return true;
    } catch (error) {
      const message = extractErrorMsg(error);

      setErrMsg(message);
      console.error("Failed to fetch product: " + errMsg);

      return false;
    } finally {
      setIsLoadingGetProduct(false);
    }
  };
  return { handleGetProduct, isLoadingGetProduct, errMsg };
};
