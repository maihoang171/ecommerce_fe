import { useParams } from "react-router-dom";
import { useProductStore } from "@/stores/useProductStore";
import { useEffect } from "react";
import { useGetProductList } from "@/hooks/useProduct";
import { ProductDetail } from "@/components/Body/ProductDetail";
import { useCategoryStore } from "@/stores/useCategoryStore";
import type { ICategory } from "@/services/category";
import { useNavigate } from "react-router-dom";

export const ProductList = () => {
  const { productList } = useProductStore();
  const { handleGetProductList } = useGetProductList();

  const { parentSlug, childSlug } = useParams();
  const {
    categoryList,
    activeParentCategory,
    activeChildCategory,
    setActiveParentCategory,
    setActiveChildCategory,
  } = useCategoryStore();

  const navigate = useNavigate();

  const displayProductList = productList.filter(
    (p) => p.categoryId === activeChildCategory?.id,
  );

  useEffect(() => {
    if (!parentSlug) {
      navigate("/not-found", { replace: true });
      return;
    }

    handleGetProductList(parentSlug, childSlug);

    if (categoryList.length > 0) {
      const parent = categoryList.find((c) => c.slug === parentSlug);

      if (!parent) {
        navigate("/not-found", { replace: true });
        return;
      }

      setActiveParentCategory(parent);

      const child = parent?.children.find((c) => c.slug === childSlug);
      setActiveChildCategory(child);

      if (!childSlug || !child) {
        navigate("/not-found", { replace: true });
        return;
      }
    }
  }, [childSlug, parentSlug, categoryList]);

  const handleClickChildCategory = (child: ICategory) => {
    setActiveChildCategory(child);
    navigate(`/${activeParentCategory?.slug}/${child.slug}`);
  };

  if (displayProductList.length > 0)
    return (
      <div>
        <div className="text-3xl font-bold">{activeChildCategory?.name}</div>

        <div className="flex gap-5 mt-5 text-xl border-b border-gray-300 hover:overflow-x-auto flex-nowrap font-light">
          {activeParentCategory?.children.map((c) => {
            const isSelected = activeChildCategory?.id === c.id;
            return (
              <button
                key={c.id}
                className={`${isSelected ? "border-b-2 border-black" : ""} hover:cursor-pointer  shrink-0`}
                onClick={() => handleClickChildCategory(c)}
              >
                {c.name}
              </button>
            );
          })}
        </div>
        <div className="my-5 text-sm text-gray-500">
          {displayProductList.length} products
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {displayProductList.map((p) => (
            <div key={p.id}>
              <ProductDetail product={p} />
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="w-full min-h-[70vh] flex justify-center items-center">
      No products has found
    </div>
  );
};
