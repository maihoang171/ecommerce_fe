import { CartToast } from "../components/CartToast";
import { queryClient } from "@/main";
import { addToCartService, type ICartItem } from "@/features/cart/services/cart";
import type { IProduct } from "@/features/product/services/product";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useCartStore } from "@/features/cart/stores/useCartStore";
import { extractErrorMsg } from "@/utils/error";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ICartVariables {
  cartItem: ICartItem;
  product: IProduct;
  stockQuantity?: number;
}

export const useAddToCart = () => {
  const { user } = useAuthStore();
  const { addToLocalCart } = useCartStore();

  return useMutation({
    mutationFn: async (variables: ICartVariables) => {
      if (!user) {
        addToLocalCart(
          {
            productId: variables.cartItem.productId,
            color: variables.cartItem.color,
            size: variables.cartItem.size,
            quantity: variables.cartItem.quantity,
          },
          variables.stockQuantity ?? Infinity,
        );

        return { success: true };
      }

      return addToCartService(variables.cartItem);
    },

    onSuccess: (_, variables) => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }

      toast.custom(
        () => (
          <CartToast
            product={variables.product}
            color={variables.cartItem.color}
            size={variables.cartItem.size}
            quantity={variables.cartItem.quantity}
          />
        ),
        {
          duration: 3000,
        },
      );
    },

    onError: (error) => {
      const msg = extractErrorMsg(error);
      console.error("Failed to add item to cart: " + msg);
    },
  });
};
