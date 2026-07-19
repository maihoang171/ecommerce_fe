import { addToCartService, type IAddToCartPayLoad } from "@/services/cart";
import type { IProduct } from "@/services/product";
import { extractErrorMsg } from "@/utils/error";
import { useState } from "react";
import { toast } from "sonner";

export const useAddToCart = () => {
  const [isLoadingAddToCart, setIsLoadingAddToCart] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const handleAddToCart = async (
    payload: IAddToCartPayLoad,
    product: IProduct,
  ) => {
    try {
      setIsLoadingAddToCart(true);
      await addToCartService(payload);

      toast.custom(() => (
        <div className="flex bg-white border border-gray-100 items-center gap-4 p-2">
          <img
            src={product.images[0].imageUrl}
            className="w-20 h-25 object-cover rounded"
          />
          <div className="ml-4">
            <div className="font-bold">{product.name}</div>
            {product.discountPrice ? (
              <div className="flex flex-row gap-4">
                <div className="text-red-400">${product.discountPrice}</div>
                <div className="line-through">${product.price}</div>
              </div>
            ) : (
              <div>{product.price}</div>
            )}
            <p>Color: {payload.color}</p>
            <p>Size: {payload.size}</p>
            <p className="text-green-400 font-bold">
              Added to cart successfully
            </p>
          </div>
        </div>
      ));

      setErrMsg("");
    } catch (error) {
      setErrMsg(extractErrorMsg(error));
      console.log("Failed when add to cart: " + errMsg);
    } finally {
      setIsLoadingAddToCart(false);
    }
  };

  return { isLoadingAddToCart, handleAddToCart, errMsg };
};
