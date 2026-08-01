import {
  getProductListByCategorySlugService,
  getProductService,
  type IProduct,
} from "@/features/product/services/product";
import { useQuery } from "@tanstack/react-query";

export const useGetProductList = (parentSlug: string, childSlug?: string) => {
  return useQuery<IProduct[], Error>({
    queryKey: ["products", parentSlug, childSlug],
    queryFn: () => getProductListByCategorySlugService(parentSlug, childSlug),
  });
};

export const useGetProduct = (id: string) => {
  return useQuery<IProduct, Error>({
    queryKey: ["product", id],
    queryFn: () => getProductService(id),
  });
};
