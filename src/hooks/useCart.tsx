import { CartToast } from "@/components/Body/CartToast";
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
        <CartToast
          product={product}
          color={payload.color}
          size={payload.size}
        />
      ));

      setErrMsg("");
    } catch (error) {
      setErrMsg(extractErrorMsg(error));

      console.error("Failed when add to cart: " + errMsg);
    } finally {
      setIsLoadingAddToCart(false);
    }
  };

  return { isLoadingAddToCart, handleAddToCart, errMsg };
};

