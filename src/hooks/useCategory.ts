import {
  getCategoryListService,
  type IParentCategory,
} from "../services/category";
// import { useCategoryStore } from "@/stores/useCategoryStore";
// import { extractErrorMsg } from "../utils/error";
// import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const useGetCategoryList = () => {
  return useQuery<IParentCategory[], Error>({
    queryKey: ["categories"],
    queryFn: () => getCategoryListService(),
  });
};
