import {
  getProductListByCategorySlugService,
  getProductService,
  type IProduct,
} from "@/services/product";
import { useQuery } from "@tanstack/react-query";

export const useGetProductList = (parentSlug: string, childSlug?: string) => {
  return useQuery<IProduct[], Error>({
    queryKey: ["products", parentSlug, childSlug],
    queryFn: () => getProductListByCategorySlugService(parentSlug, childSlug)
  })
}

export const useGetProduct = (id: string) => {
 return useQuery<IProduct, Error>({
  queryKey: ["product"],
  queryFn: () => getProductService(id)
 })
};
