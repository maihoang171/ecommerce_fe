import { useNavigate, useParams } from "react-router-dom";
import { useGetProductList } from "@/hooks/useProduct";
import { ProductCard } from "@/components/Body/ProductCard";
import { Loading } from "@/components/Body/Loading";
import type { IProduct } from "@/services/product";
import { ServerError } from "./ServerError";
import { useGetCategoryList } from "@/hooks/useCategory";
import type { IParentCategory } from "@/services/category";

export const ProductList = () => {
  const { parentSlug, childSlug } = useParams<{
    parentSlug?: string;
    childSlug?: string;
  }>();

  const { data: categoryList } = useGetCategoryList();
  const {
    data: products,
    isLoading,
    error,
  } = useGetProductList(parentSlug ?? "", childSlug);

  const categories = (categoryList as IParentCategory[]) || [];
  const currentCategoryList = categories.find((c) => c.slug === parentSlug);

  const productList = (products as IProduct[]) || [];

  const currentChildCategory = currentCategoryList?.children?.find(
    (c) => c.slug === parentSlug,
  );

  const navigate = useNavigate();
  if (error) {
    return <ServerError />;
  }

  if (isLoading) return <Loading />;

  return (
    <div className="mb-5">
      <div className="text-3xl font-bold">{currentChildCategory?.name}</div>

      <div className="flex gap-5 mt-5 text-xl border-b border-gray-300 hover:overflow-x-auto flex-nowrap font-light">
        {currentCategoryList?.children.map((c) => {
          const isSelected = childSlug === c.slug;
          return (
            <button
              key={c.id}
              className={`${isSelected ? "border-b-2 border-black" : ""} hover:cursor-pointer  shrink-0`}
              onClick={() => navigate(`/${parentSlug}/${c.slug}`)}
            >
              {c.name}
            </button>
          );
        })}
      </div>
      <div className="my-5 text-sm text-gray-500">
        {productList.length} products
      </div>

      {productList.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {productList.map((p) => (
            <div key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full min-h-[70vh] flex justify-center items-center">
          No products has found
        </div>
      )}
    </div>
  );
};
