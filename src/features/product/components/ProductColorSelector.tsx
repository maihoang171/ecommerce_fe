import type { IProduct } from "../services/product";
import React from "react";
import { COLOR_DICTIONARY } from "@/constants/product";

// const ALLOWED_COLORS = Object.keys(COLOR_DICTIONARY)
interface IProductColorSelectorProps {
  product: IProduct;
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

type AllowedColors = keyof typeof COLOR_DICTIONARY;

export const ProductColorSelector = ({
  product,
  selectedColor,
  onSelectColor,
}: IProductColorSelectorProps) => {
  if (!product?.variants) return null;

  const allColors = product.variants.map((v) => v.color);
  const uniqueColors = Array.from(new Set(allColors));

  const handleSelectColor = (
    e: React.MouseEvent<HTMLButtonElement>,
    color: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    onSelectColor(color);
  };

  return (
    <div className="flex flex-row gap-2">
      {uniqueColors.map((colorName) => {
        const isSelected = selectedColor === colorName;

        const hexCode = COLOR_DICTIONARY[colorName as AllowedColors];

        return (
          <button
            key={colorName}
            title={colorName}
            aria-label={colorName}
            className={`w-6 h-6 gap-2 rounded-full cursor-pointer transition-all border-gray-400 ${isSelected ? "ring-2 ring-black ring-offset-2 " : "border"}`}
            style={{ backgroundColor: hexCode }}
            onClick={(e) => handleSelectColor(e, colorName)}
          />
        );
      })}
    </div>
  );
};
