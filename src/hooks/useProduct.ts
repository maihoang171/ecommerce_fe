import {
  getProductListByCategorySlugService,
  getProductService,
} from "@/services/product";
import { useProductStore } from "../stores/useProductStore";
import { extractErrorMsg } from "@/utils/error";
import { useState } from "react";

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

export const useGetProduct = () => {
  const { setProduct } = useProductStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetProduct = async (productId: string, categoryId: string) => {
    setIsLoading(true);
    try {
      const res = await getProductService(productId, categoryId);
      const product = res.data;

      if (!product) {
        throw Error("Product not found");
      }

      setProduct(product);
    } catch (error) {
      const errMsg = extractErrorMsg(error);

      console.error("Failed to fetch product: " + errMsg);
    } finally {
      setIsLoading(false);
    }
  };
  return { handleGetProduct, isLoading };
};
