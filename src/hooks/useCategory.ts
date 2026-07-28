import {
  getCategoryListService,
  type IParentCategory,
} from "../services/category";
import { useQuery } from "@tanstack/react-query";

export const useGetCategoryList = () => {
  return useQuery<IParentCategory[], Error>({
    queryKey: ["categories"],
    queryFn: () => getCategoryListService(),
  });
};
