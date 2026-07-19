import {
  getProductListByCategorySlugService,
  getProductService,
} from "@/services/product";
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
