import type { IProduct } from "@/services/product";
import React from "react";

const COLOR_DICTIONARY: Record<string, string> = {
  MIDNIGHT_BLUE: "#1e3a8a",
  CRIMSON_RED: "#991b1b",
  VINTAGE_WASH: "#7ca1c0",
  CHARCOAL: "#374151",
  CLASSIC_WHITE: "#ffffff",
  CLASSIC_RED: "#dc2626",
  CLASSIC_BLACK: "#000000",
  CLASSIC_YELLOW: "#fbbf24",
  CLASSIC_ORANGE: "#f97316",
};

interface IProductColorSelectorProps {
  product: IProduct;
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export const ProductColorSelector = ({
  product,
  selectedColor,
  onSelectColor,
}: IProductColorSelectorProps) => {
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
    <div className="flex flex-row gap-2 grow">
      {uniqueColors.map((colorName) => {
        const isSelected = selectedColor === colorName;

        const hexCode = COLOR_DICTIONARY[colorName];

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
