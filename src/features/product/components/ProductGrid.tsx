import { Loading } from "@/components/Loading";
import type { IProduct } from "../services/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products?: IProduct[];
  isPending?: boolean;
  emptyMessage?: string;
}
export const ProductGrid = ({
  products,
  isPending,
  emptyMessage = "No product found",
}: ProductGridProps) => {
  if (isPending) {
    return <Loading />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex justify-center items-center">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {" "}
      <div className="my-5 text-sm text-gray-500">
        {products?.length ?? 0} items
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((p) => (
          <div key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </>
  );
};
