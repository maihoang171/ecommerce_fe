import {
  getProductListByCategorySlugService,
  getProductService,
  searchProductsService,
} from "@/features/product/services/product";
import { useQuery } from "@tanstack/react-query";

export const useGetProductList = (parentSlug: string, childSlug?: string) => {
  return useQuery({
    queryKey: ["product", parentSlug, childSlug],
    queryFn: () => getProductListByCategorySlugService(parentSlug, childSlug),
    enabled: Boolean(parentSlug),
  });
};

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", "detail", id],
    queryFn: () => getProductService(id),
    enabled: Boolean(id),
  });
};

export const useSearchProducts = (q: string) => {
  return useQuery({
    queryKey: ["product", "search", q],
    queryFn: () => searchProductsService(q),
    enabled: Boolean(q.trim()),
  });
};
