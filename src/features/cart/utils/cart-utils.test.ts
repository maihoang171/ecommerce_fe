import { describe, expect, it } from "vitest";
import { getNormalizedCartItems } from "./cart-utils";
import { mockUser } from "@/tests/mockUserData";
import { mockDbCart, mockLocalCartItems } from "@/tests/mockCartData";

describe("getNormalizedCartItems", () => {
  it("should normalize DB cart items when user is logged in and DB cart items exist", () => {
    const result = getNormalizedCartItems(
      mockUser,
      mockDbCart,
      mockLocalCartItems,
    );
    const dbItem = mockDbCart.items[0];

    expect(result).toHaveLength(mockDbCart.items.length);

    expect(result[0]).toEqual({
      id: dbItem.id,
      productId: dbItem.productVariant.product?.id,
      color: dbItem.productVariant.color,
      size: dbItem.productVariant.size,
      quantity: dbItem.quantity,
      name: dbItem.productVariant.product?.name,
      price: dbItem.productVariant.product?.price,
      discountPrice: dbItem.productVariant.product?.discountPrice,
      images: dbItem.productVariant.product?.images,
      stockQuantity: dbItem.productVariant.stockQuantity,
    });
  });

  it("should normalize local cart items when user is not logged in (guest)", () => {
    const result = getNormalizedCartItems(null, undefined, mockLocalCartItems);
    const firstLocalItem = mockLocalCartItems[0];

    expect(result).toHaveLength(mockLocalCartItems.length);
    expect(result[0]).toEqual({
      id: `local-${firstLocalItem.productId}-${firstLocalItem.color}-${firstLocalItem.size}-0`,
      productId: firstLocalItem.productId,
      color: firstLocalItem.color,
      size: firstLocalItem.size,
      quantity: firstLocalItem.quantity,
      name: firstLocalItem.name,
      price: firstLocalItem.price,
      discountPrice: firstLocalItem.discountPrice,
      images: firstLocalItem.images,
      stockQuantity: firstLocalItem.stockQuantity,
    });

    const secondLocalItem = mockLocalCartItems[1];
    expect(result[1].id).toBe(
      `local-${secondLocalItem.productId}-${secondLocalItem.color}-${secondLocalItem.size}-1`,
    );
  });
});
