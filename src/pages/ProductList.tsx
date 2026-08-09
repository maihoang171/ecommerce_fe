import { useNavigate, useParams } from "react-router-dom";
import { useGetProductList } from "@/features/product/hooks/useProduct";
import { Loading } from "@/components/Loading";
import type { IProduct } from "@/features/product/services/product";
import { ServerError } from "@/pages/ServerError";
import { useGetCategoryList } from "@/features/category/hooks/useCategory";
import type { IParentCategory } from "@/features/category/services/category";
import { extractErrorMsg } from "@/utils/error";
import { useEffect } from "react";
import { ProductGrid } from "@/features/product/components/ProductGrid";

export const ProductList = () => {
  const { parentSlug, childSlug } = useParams<{
    parentSlug: string;
    childSlug: string;
  }>();

  const navigate = useNavigate();

  const { data: categoryList, isPending: isCategoryLoading } =
    useGetCategoryList();

  const {
    data: products,
    isPending: isGetProductListPending,
    isError,
    error,
  } = useGetProductList(parentSlug ?? "", childSlug);

  const categories = (categoryList as IParentCategory[]) || [];
  const currentCategoryList = categories.find((c) => c.slug === parentSlug);
  const productList = (products as IProduct[]) || [];

  useEffect(() => {
    if (!isCategoryLoading) {
      const isParentSlugValid = categories.some((c) => c.slug === parentSlug);
      if (!isParentSlugValid) {
        navigate("/not-found", { replace: true });
        return;
      }
    }
  }, [parentSlug, categoryList, isCategoryLoading]);

  const currentChildCategory = currentCategoryList?.children?.find(
    (c) => c.slug === parentSlug,
  );

  if (isError) {
    const msg = extractErrorMsg(error);
    return <ServerError message={msg} />;
  }

  if (isCategoryLoading) return <Loading />;

  return (
    <div className="mb-5">
      <div className="text-3xl font-bold">{currentChildCategory?.name}</div>

      <div className="flex mt-5 md:mt-0 gap-5 text-xl border-b border-gray-300 hover:overflow-x-auto flex-nowrap font-light">
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

      <ProductGrid
        products={productList}
        isPending={isGetProductListPending}
        emptyMessage="No product found in this category!"
      />
    </div>
  );
};
