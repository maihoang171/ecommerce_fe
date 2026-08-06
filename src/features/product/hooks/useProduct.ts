import {
  getProductListByCategorySlugService,
  getProductService,
} from "@/features/product/services/product";
import { useQuery } from "@tanstack/react-query";

export const useGetProductList = (parentSlug: string, childSlug?: string) => {
  return useQuery({
    queryKey: ["products", parentSlug, childSlug],
    queryFn: () => getProductListByCategorySlugService(parentSlug, childSlug),
  });
};

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductService(id),
  });
};
