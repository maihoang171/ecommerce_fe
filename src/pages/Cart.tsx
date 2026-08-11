import { Loading } from "@/components/Loading";
import { useDeleteCartItem, useGetCart } from "@/features/cart/hooks/useCart";
import { extractErrorMsg } from "@/utils/error";
import { ServerError } from "./ServerError";
import { ProductQuantitySelector } from "@/features/product/components/ProductQuantitySelector";
import { Trash2 } from "lucide-react";
import { PriceDisplay } from "@/components/PriceDisplay";
import { Link } from "react-router-dom";
import { useCartStore } from "@/features/cart/stores/useCartStore";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import {
  getNormalizedCartItems,
  type IUiCartItem,
} from "@/features/cart/utils/cart-utils";
import { useMemo } from "react";
export const Cart = () => {
  const { user } = useAuthStore();
  const { cart: localCart } = useCartStore();
  const { data: dbCart, isPending, error, isError } = useGetCart();
  const { mutate: handleDeleteCartItem, isPending: isDeleting } =
    useDeleteCartItem();

  const cartItems: IUiCartItem[] = useMemo(() => {
    return getNormalizedCartItems(user, dbCart, localCart);
  }, [user, dbCart, localCart]);

  const totalPrice = useMemo(() => {
    return cartItems
      .reduce((sum, item) => {
        const finalPrice = item.discountPrice ?? item.price;
        return sum + finalPrice * item.quantity;
      }, 0)
      .toFixed(2);
  }, [cartItems]);

  if (user && isPending) {
    return <Loading />;
  }

  if (user && isError) {
    const msg = extractErrorMsg(error);
    return <ServerError message={msg} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-xl mb-4 font-bold">My cart</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {cartItems.map((item) => {
            const activeImage = item.images.find((img) => img.isPrimary);

            const unitPrice = item.discountPrice ?? item.price;
            const totalProductPrice = unitPrice * item.quantity;

            // TODO: handle update item quantity
            const handleQuantityChange = () => {};

            return (
              <div
                aria-label="item-information"
                key={item.id}
                className="flex flex-row gap-4 mb-4"
              >
                <img
                  src={activeImage?.imageUrl}
                  className="w-28"
                  alt={`${item.name} image`}
                />
                <section>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-gray-400">
                    {item.color} / {item.size}
                  </p>
                  <PriceDisplay
                    discountPrice={item.discountPrice}
                    price={item.price}
                  />
                  <div className="flex flex-row gap-2">
                    <ProductQuantitySelector
                      quantity={item.quantity}
                      stockQuantity={item.stockQuantity}
                      onQuantityChange={handleQuantityChange}
                    />
                    <button
                      className="hover:cursor-pointer hover:text-gray-400"
                      disabled={isDeleting}
                      onClick={() => handleDeleteCartItem(item)}
                      data-testid="delete-cart-item-button"
                    >
                      <Trash2 className="w-4" />
                    </button>
                  </div>
                  <div>Total: ${totalProductPrice}</div>
                </section>
              </div>
            );
          })}
        </div>

        <div aria-label="check-out">
          <div className="sticky top-16 hidden md:flex flex-col gap-4 md:w-80  font-bold">
            <div className="flex justify-between">
              <span>Total Order</span> <span>${totalPrice}</span>
            </div>
            {/* TODO: handle checkout */}

            <button className="w-full h-8 bg-black text-white hover:cursor-pointer hover:bg-gray-700">
              Checkout
            </button>
            <Link
              to={"/"}
              className="flex items-center justify-center w-full h-8 border text-black hover:border-gray-400 hover:text-gray-400"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 pb-2 bg-white md:hidden">
        {/* TODO: handle click button */}
        <button className="flex flex-row justify-between px-4 items-center font-bold bg-black w-full h-8 text-white hover:cursor-pointer">
          <div>${totalPrice}</div>
          <p>Continue</p>
        </button>
      </div>
    </div>
  );
};
