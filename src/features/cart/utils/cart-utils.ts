import type { IProductImage } from "@/features/product/services/product";
import type { IDbCart } from "../services/cart";
import type { ILocalCartItem } from "../stores/useCartStore";
import type { IUser } from "@/features/auth/services/auth";

export interface IUiCartItem {
  id: string | number;
  productId: number;
  color: string;
  size: string;
  quantity: number;
  name: string;
  price: number;
  discountPrice?: number | null;
  images: IProductImage[];
  stockQuantity: number;
}

export const getNormalizedCartItems = (
  user?: IUser | null,
  dbCart?: IDbCart,
  localCart: ILocalCartItem[] = [],
): IUiCartItem[] => {
  if (user && dbCart?.items) {
    return dbCart.items.map((item) => ({
      id: item.id,
      productId: item.productVariant.product?.id,
      color: item.productVariant.color,
      size: item.productVariant.size,
      quantity: item.quantity,
      name: item.productVariant.product?.name,
      price: item.productVariant.product?.price,
      discountPrice: item.productVariant.product?.discountPrice,
      images: item.productVariant.product?.images,
      stockQuantity: item.productVariant.stockQuantity,
    }));
  }

  return localCart.map((item, index) => ({
    id: `local-${item.productId}-${item.color}-${item.size}-${index}`,
    productId: item.productId,
    color: item.color,
    size: item.size,
    quantity: item.quantity,
    name: item.name,
    price: item.price,
    discountPrice: item.discountPrice,
    images: item.images,
    stockQuantity: item.stockQuantity,
  }));
};
