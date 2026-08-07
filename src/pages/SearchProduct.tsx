import { Loading } from "@/components/Loading";
import { ProductCard } from "@/features/product/components/ProductCard";
import { useSearchProducts } from "@/features/product/hooks/useProduct";
import { useSearchParams } from "react-router-dom";

export const SearchProduct = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data: products, isPending } = useSearchProducts(query);

  if (isPending) {
    return <Loading />;
  }
  return (
    <>
      {products?.map((p) => {
        <ProductCard product={p} />;
      })}
    </>
  );
};
