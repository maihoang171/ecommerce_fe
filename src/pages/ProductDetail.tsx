import { useGetProduct } from "@/hooks/useProduct";
import { useProductStore } from "@/stores/useProductStore";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ProductColorSelector } from "@/components/Body/ProductColorSelector";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination } from "swiper/modules";
import { Loading } from "@/components/Body/Loading";
import { ProductSizeSelector } from "@/components/Body/ProductSizeSelector";
import { ProductCard } from "@/components/Body/ProductCard";
import type { IProduct } from "@/services/product";
export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { product, productList, setProduct } = useProductStore();

  const { handleGetProduct, isLoading } = useGetProduct();

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const selectedColor = searchParams.get("color");
  const selectedSize = searchParams.get("size");

  useEffect(() => {
    setProduct({} as IProduct);

    if (
      !id ||
      isNaN(Number(id)) ||
      !categoryId ||
      isNaN(Number(categoryId)) ||
      !selectedColor
    ) {
      navigate("/not-found", { replace: true });
      return;
    }

    handleGetProduct(id, categoryId);
  }, [id, categoryId, selectedColor]);

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

  const activeImages = useMemo(() => {
    if (!product || !product.images) return [];

    return product.images.filter((img) => img.color === selectedColor);
  }, [product, selectedColor]);

  const stockQuantity = useMemo(() => {
    if (!product || !product.variants) return 0;

    if (selectedSize)
      return (
        product.variants.find(
          (v) => v.color === selectedColor && v.size === selectedSize,
        )?.stockQuantity ?? 0
      );

    //return all items when no size is selected
    return product.variants
      .filter((v) => v.color === selectedColor)
      .reduce((total, v) => total + v.stockQuantity, 0);
  }, [product, selectedColor, selectedSize]);

  if (isLoading || !product) {
    return <Loading />;
  }

  const relatedProducts = productList.filter((p) => p.id != product.id);

  return (
    <div>
      <section className="flex flex-col md:gap-5 md:flex-row h-full lg:h-2/3">
        <Swiper
          className="w-full md:w-3/5 h-full"
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
          }}
        >
          {activeImages.map((image) => (
            <SwiperSlide key={image.id}>
              <img
                src={image.imageUrl}
                className="w-full lg:h-2/3 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex-1 mt-5 space-y-5 md:px-12 ">
          <div className="font-bold text-2xl">{product.name}</div>

          {product.discountPrice ? (
            <div className="flex flex-row gap-5">
              <div className="text-red-500">${product.discountPrice}</div>
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
            <div className="text-sm">Only {stockQuantity} items left</div>
          </div>

          <ProductColorSelector
            product={product}
            selectedColor={selectedColor || ""}
            onSelectColor={handleSelectColor}
          />

          <ProductSizeSelector
            product={product}
            selectedColor={selectedColor || ""}
            selectedSize={selectedSize || ""}
            onSelectSize={handleSelectSize}
          />

          {/* Handle size guide */}
          <div className="flex justify-end items-center">
            <button className="link transition-transform hover:scale-110 hover:text-gray-500">
              Size guide
            </button>
          </div>

          {/* Handle add to cart */}
          <button className="my-4 w-full p-3 bg-black text-white hover:cursor-pointer hover:bg-gray-500 text-xl">
            Add to cart
          </button>
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
          {relatedProducts.map((rp) => (
            <SwiperSlide>
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
