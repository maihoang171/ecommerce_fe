import { CartToast } from "../components/CartToast";
import { queryClient } from "@/main";
import {
  addToCartService,
  deleteCartItemService,
  getCartService,
  type IDbCartItemPayLoad,
} from "@/features/cart/services/cart";
import type { IProduct } from "@/features/product/services/product";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import {
  useCartStore,
  type ILocalCartItem,
} from "@/features/cart/stores/useCartStore";
import { extractErrorMsg } from "@/utils/error";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { IUiCartItem } from "../utils/cart-utils";

interface ICartVariables {
  cartItem: ILocalCartItem | IDbCartItemPayLoad;
  product: IProduct;
}

export const useAddToCart = () => {
  const { user } = useAuthStore();
  const { addToLocalCart, getItemQuantity } = useCartStore();

  return useMutation({
    mutationFn: async (variables: ICartVariables) => {
      if (!user) {
        const localCartItem = variables.cartItem as ILocalCartItem;
        const currentInCart = getItemQuantity(
          localCartItem.productId,
          localCartItem.color,
          localCartItem.size,
        );
        const stockLimit = localCartItem.stockQuantity;
        if (currentInCart + localCartItem.quantity > stockLimit) {
          throw Error("Requested quantity exceeds stock quantity available!");
        }

        addToLocalCart({
          productId: localCartItem.productId,
          color: localCartItem.color,
          size: localCartItem.size,
          quantity: localCartItem.quantity,
          stockQuantity: localCartItem.stockQuantity,
          name: localCartItem.name,
          price: localCartItem.price,
          discountPrice: localCartItem.discountPrice,
          images: localCartItem.images,
        } as ILocalCartItem);

        return { success: true };
      }

      return addToCartService(variables.cartItem as IDbCartItemPayLoad);
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

export const useGetCart = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => getCartService(),
    enabled: !!user,
  });
};

export const useDeleteCartItem = () => {
  const { user } = useAuthStore();
  const { removeFromLocalCart } = useCartStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartItem: IUiCartItem) => {
      if (!user) {
        removeFromLocalCart(cartItem.productId, cartItem.color, cartItem.size);
        return;
      }
      return await deleteCartItemService(Number(cartItem.id));
    },

    onSuccess: (_, cartItem) => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }

      toast.success(`${cartItem.name} deleted successfully`, {
        position: "bottom-right",
      });
    },

    onError: (error) => {
      const msg = extractErrorMsg(error);
      toast.error("Failed to delete item: " + msg, {
        position: "bottom-right",
      });
    },
  });
};
