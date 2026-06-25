import type { IProduct } from "@/services/product";
import { Link } from "react-router-dom";
import { ProductColorSelector } from "./ProductColorSelector";
import { useState, useEffect } from "react";

interface IProductDetailState {
  product: IProduct;
}

export const ProductDetail = ({ product }: IProductDetailState) => {
  const discountPercent = product.discountPrice
    ? ((product.price - product.discountPrice) / product.price) * 100
    : 0;

  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants[0].color,
  );

  const activeImage =
    product.images.find(
      (img) => img.color === selectedColor && img.isPrimary,
    ) ||
    product.images.find((img) => img.color === selectedColor) ||
    product.images[0];

  useEffect(() => {
    product.images.forEach((image) => {
      const img = new Image();
      img.src = image.imageUrl;
    });
  }, []);

  return (
    <Link to={`/product?id=${product.id}`}>
      <div className="group cursor-pointer aspect-square">
        <div className="relative overflow-hidden ">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            src={activeImage.imageUrl}
            alt={product.name}
            aria-label={product.name}
          />

          {product.discountPrice && (
            <div>
              <div className="absolute bottom-0 left-0 border border-black bg-black text-white px-3">
                -{discountPercent}%
              </div>
            </div>
          )}
        </div>

        {product.discountPrice ? (
          <div>
            <div className="line-clamp-1">{product.name}</div>

            <div className="flex flex-row gap-5">
              <div className="text-red-500">${product.discountPrice}</div>

              <div className="line-through">${product.price}</div>
            </div>
          </div>
        ) : (
          <div>
            <div className="line-clamp-1">{product.name}</div>
            <div>${product.price}</div>
          </div>
        )}

        <ProductColorSelector
          product={product}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
        />
      </div>
    </Link>
  );
};
