// import { useGetProduct } from "@/hooks/useProduct";
// import { useProductStore } from "@/stores/useProductStore";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { ProductColorSelector } from "@/components/Body/ProductColorSelector";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import { Pagination } from "swiper/modules";

export const ProductDetail = () => {
  // const navigate = useNavigate();
  // const { handleGetProduct, isLoading } = useGetProduct();
  // const { product } = useProductStore();

  // const { id } = useParams();
  // const [searchParams, setSearchParams] = useSearchParams();

  // const [selectedColor, setSelectedColor] = useState<string>(
  //   searchParams.get("color") || "",
  // );

  // const categoryId = searchParams.get("categoryId");

  // useEffect(() => {
  //   if (!id || !categoryId) {
  //     navigate("/", { replace: true });
  //     return;
  //   }

  //   handleGetProduct(id, categoryId);
  // }, [id, categoryId]);

  // if (isLoading) {
  //   return <div className="loading loading-spinner loading-xs " />;
  // }

  // const activeImages = product.images.filter(
  //   (img) => img.color === selectedColor,
  // );

  // const handleSelectColor = (color: string) => {
  //   setSearchParams({ color, categoryId: categoryId || "" });
  //   setSelectedColor(color);
  // };

  return (
    <div className="md:flex flex-row">
      {/* phone */}
      {/* <div className="md:hidden">
        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          pagination={{ clickable: true }}
        >
          {activeImages.map((i) => (
            <SwiperSlide key={i.id}>
              <img src={i.imageUrl} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div> */}
  
      {/* Desktop */}
      {/* <div className="md:grid grid-cols-2 md:max-w-[50vw] gap-1 hidden">
        {activeImages.map((i) => (
          <img key={i.id} src={i.imageUrl} />
        ))}
      </div>
      <div className="">
        <div>{product.name}</div>
        <div>{product.discountPrice}</div>
        <div>{product.price}</div>

        <div>Color: {selectedColor}</div>
        <ProductColorSelector
          product={product}
          selectedColor={selectedColor}
          onSelectColor={(color) => handleSelectColor(color)}
        />
      </div> */}
    </div>
  );
};
