import { useGetProduct } from "@/features/product/hooks/useProduct";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { ProductColorSelector } from "@/features/product/components/ProductColorSelector";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination } from "swiper/modules";
import { Loading } from "@/components/Loading";
import { ProductSizeSelector } from "../features/product/components/ProductSizeSelector";
import { ProductCard } from "../features/product/components/ProductCard";
import { useAddToCart } from "@/features/cart/hooks/useCart";
import type { ICartItem } from "@/features/cart/services/cart";
import { ServerError } from "@/pages/ServerError";
import { extractErrorMsg } from "@/utils/error";
import { ProductQuantitySelector } from "../features/product/components/ProductQuantitySelector";
import { useState } from "react";

export const ProductDetail = () => {
  const { id } = useParams();

  const {
    data: product,
    isPending: isGetProductPending,
    isError: isErrorGetProduct,
    error: getProductError,
  } = useGetProduct(id ?? "");

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedColor = searchParams.get("color");
  const selectedSize = searchParams.get("size");

  const [quantity, setQuantity] = useState<number>(1);

  const {
    mutate: handleAddToCart,
    isPending: isAddToCartPending,
    error: addToCartError,
  } = useAddToCart();

  const activeImages = product?.images
    ? product.images.filter((img) => img.color === selectedColor)
    : [];

  const stockQuantity = product?.variants
    ? selectedSize
      ? (product.variants.find(
          (v) => v.color === selectedColor && v.size === selectedSize,
        )?.stockQuantity ?? 0)
      : product.variants
          .filter((v) => v.color === selectedColor)
          .reduce((total, v) => total + v.stockQuantity, 0)
    : 0;

  const isInvalidId = !id || isNaN(Number(id));
  const isInvalidColor = !selectedColor;

  if (isInvalidId || isInvalidColor) {
    return <Navigate to="not-found" replace />;
  }

  if (isGetProductPending) {
    return <Loading />;
  }

  if (isErrorGetProduct) {
    const msg = extractErrorMsg(getProductError);
    return <ServerError message={msg} />;
  }

  if (!product) return <Navigate to="not-found" replace />;

  const onAddToCart = () => {
    const cartItem: ICartItem = {
      productId: Number(product.id),
      color: selectedColor,
      size: selectedSize!,
      quantity: quantity,
    };

    handleAddToCart({ cartItem, product });
  };

  const handleSelectColor = (color: string) => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set("color", color);
    nextParams.delete("size");
    setSearchParams(nextParams);
  };

  const handleSelectSize = (size: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("size", size);
    setSearchParams(nextParams);
  };

  return (
    <div>
      <section className="flex flex-col md:gap-5 md:flex-row h-full ">
        <Swiper
          className="w-full md:w-3/5 lg:w-1/2"
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
          }}
        >
          {activeImages.map((image) => (
            <SwiperSlide key={image.id}>
              <img src={image.imageUrl} className="w-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex-1 mt-5 space-y-5 lg:px-48 lg:pt-16">
          <div className="font-bold text-2xl">{product.name}</div>

          {product?.discountPrice ? (
            <div className="flex flex-row gap-5">
              <div className="text-red-500" data-testid="discount-price">
                ${product.discountPrice}
              </div>
              <div className="line-through">${product.price}</div>
            </div>
          ) : (
            <div>
              <div data-testid="original-price">${product.price}</div>
            </div>
          )}

          <div>
            {" "}
            <div className="font-bold">{selectedColor}</div>
            <div className="text-sm" data-testid="stock-quantity">
              Only {stockQuantity} items left
            </div>
          </div>

          <ProductColorSelector
            product={product}
            selectedColor={selectedColor}
            onSelectColor={handleSelectColor}
          />

          <ProductSizeSelector
            product={product}
            selectedColor={selectedColor}
            selectedSize={selectedSize ?? ""}
            onSelectSize={handleSelectSize}
          />

          {/* Handle size guide */}
          <div className="flex justify-end items-center">
            <button className="link transition-transform hover:scale-110 hover:text-gray-500">
              Size guide
            </button>
          </div>

          {addToCartError && (
            <div className="text-red-400 text-center">
              {extractErrorMsg(addToCartError)}
            </div>
          )}
          {/* Handle add to cart */}

          <div className="flex flex-rows gap-2 h-16 my-4 py-3">
            <ProductQuantitySelector
              quantity={quantity}
              stockQuantity={stockQuantity}
              onQuantityChange={setQuantity}
            />
            <button
              onClick={onAddToCart}
              type="submit"
              className="w-full bg-black text-white hover:cursor-pointer hover:bg-gray-500 text-xl disabled:bg-gray-400"
              disabled={!selectedSize}
            >
              {isAddToCartPending ? (
                <div
                  className="loading loading-spinner"
                  data-testid="add-to-cart-loading"
                />
              ) : (
                <p className="text-sm">Add to cart</p>
              )}
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="h2 font-bold text-xl mt-5">Related products</div>

        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 3,
            },
          }}
        >
          {product?.relatedProducts?.map((rp) => (
            <SwiperSlide key={rp.id}>
              <div className="p-2">
                <ProductCard product={rp} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
};
