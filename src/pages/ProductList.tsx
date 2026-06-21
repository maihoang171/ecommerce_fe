// import { useCategoryListStore } from "../stores/useCategoryStore";
import { useParams } from "react-router-dom";
import { useProductListStore } from "@/stores/useProductStore";
import { useEffect } from "react";
import { useGetProductList } from "@/hooks/useCategory";

export const ProductList = () => {
  const { productList } = useProductListStore();
  const { handleGetProductList } = useGetProductList();
  const { parentSlug, childSlug } = useParams();

  useEffect(() => {
    if (parentSlug) {
      handleGetProductList(parentSlug, childSlug);
    }
  }, [childSlug, parentSlug]);

  return (
    <>
      {productList.length > 0 ? (
        productList.map((p) => <div key={p.id}>{p.name}</div>)
      ) : (
        <div>No products found</div>
      )}
    </>
  );
};
