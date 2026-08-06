import type {
  IDbCart,
  IDbCartItemPayLoad,
} from "@/features/cart/services/cart";
import { mockProducts } from "./mockProductData";
import type { ILocalCartItem } from "@/features/cart/stores/useCartStore";
import { mockUser } from "./mockUserData";

export const mockLocalCartItems: ILocalCartItem[] = [
  {
    productId: mockProducts[0].id,
    color: mockProducts[0].variants[1].color, // "Red"
    size: mockProducts[0].variants[1].size, // "M"
    quantity: 2,
    stockQuantity: mockProducts[0].variants[1].stockQuantity, // 5
    name: mockProducts[0].name,
    price: mockProducts[0].price,
    discountPrice: mockProducts[0].discountPrice,
    images: mockProducts[0].images,
  },
  {
    productId: 1,
    color: mockProducts[0].variants[3].color, // "Blue"
    size: mockProducts[0].variants[3].size, // "S"
    quantity: 1,
    stockQuantity: mockProducts[0].variants[3].stockQuantity, // 10
    name: mockProducts[0].name,
    price: mockProducts[0].price,
    discountPrice: mockProducts[0].discountPrice,
    images: mockProducts[0].images,
  },
  {
    productId: 2,
    color: mockProducts[1].variants[0].color, // "Black"
    size: mockProducts[1].variants[0].size, // "S"
    quantity: 3,
    stockQuantity: mockProducts[1].variants[0].stockQuantity, // 8
    name: mockProducts[1].name,
    price: mockProducts[1].price,
    discountPrice: null,
    images: mockProducts[1].images,
  },
];

export const mockDbCartItemPayload: IDbCartItemPayLoad = {
  productId: 10,
  color: "Red",
  size: "M",
  quantity: 1,
};

export const mockDbCart: IDbCart = {
  id: 501,
  userId: mockUser.id,
  items: [
    {
      id: 1001,
      quantity: 2,
      productVariant: mockProducts[0].variants[0],
    },
    {
      id: 1002,
      quantity: 1,
      productVariant: mockProducts[1].variants[0],
    },
  ],
};
