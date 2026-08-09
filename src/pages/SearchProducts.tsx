import { Loading } from "@/components/Loading";
import { ProductGrid } from "@/features/product/components/ProductGrid";
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
      <div>Search result</div>
      <div className="font-bold text-4xl px-2">{query}</div>
      <ProductGrid
        products={products}
        isPending={isPending}
        emptyMessage={`No products found matching ${query}!`}
      />
    </>
  );
};
