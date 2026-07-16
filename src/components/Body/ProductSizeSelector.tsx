import type { IProduct } from "@/services/product";

interface IProductSizeSelectorProps {
  product: IProduct;
  selectedColor: string;
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

export const ProductSizeSelector = ({
  product,
  selectedColor,
  selectedSize,
  onSelectSize,
}: IProductSizeSelectorProps) => {
  if (!product?.variants) return null;

  const allProductSizes = Array.from(
    new Set(product.variants.map((v) => v.size)),
  );

  return (
    <div>
      {allProductSizes.map((size) => {
        const variantForThisColor = product.variants.find(
          (v) => v.color === selectedColor && v.size === size,
        );

        const isOutOfStock =
          !variantForThisColor || variantForThisColor.stockQuantity <= 0;

        const isSelected = selectedSize === size;
        return (
          <button
            key={size}
            disabled={isOutOfStock}
            onClick={() => onSelectSize(size as string)}
            className={`min-w-16 px-4 py-2 border hover:cursor-pointer ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 border-gray-200 line-through cursor-not-allowed opacity-70"
                : isSelected
                  ? "bg-black text-white border-black font-bold"
                  : "bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50"
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
};
