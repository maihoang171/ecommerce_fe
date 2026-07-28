import { CartToast } from "@/components/Body/CartToast";
import { queryClient } from "@/main";
import { addToCartService, type IAddToCartPayLoad } from "@/services/cart";
import type { IProduct } from "@/services/product";
import { extractErrorMsg } from "@/utils/error";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ICartVariables {
  payload: IAddToCartPayLoad;
  product: IProduct;
}
export const useAddToCart = () => {
  return useMutation({
    mutationFn: (variables: ICartVariables) =>
      addToCartService(variables.payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      toast.custom(() => (
        <CartToast
          product={variables.product}
          color={variables.payload.color}
          size={variables.payload.size}
        />
      ));
    },

    onError: (err) => {
      const msg = extractErrorMsg(err);
      console.error("Failed to add item to cart: " + msg);
    },
  });
};
