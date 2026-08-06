// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { LOCAL_STORAGE_KEY, useCartStore } from "./useCartStore";
import { mockLocalCartItems } from "@/tests/mockCartData";

describe("cart store", () => {
  beforeEach(() => {
    localStorage.clear();

    useCartStore.setState({
      cart: [],
    });
  });

  it("should get cart from localStorage", () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([mockLocalCartItems[0]]),
    );

    const cart = useCartStore.getState().getLocalCart();

    expect(cart).toEqual([mockLocalCartItems[0]]);
  });

  it("should return 0 if the item is not in the cart", () => {
    useCartStore.getState().setCart([mockLocalCartItems[0]]);

    // Query for an item that isn't added yet
    const qty = useCartStore.getState().getItemQuantity(999, "Black", "L");

    expect(qty).toBe(0);
  });

  it("should return correct quantity for an existing item", () => {
    // mockLocalCartItems[0] has quantity = 2
    useCartStore.getState().setCart([mockLocalCartItems[0]]);

    const qty = useCartStore.getState().getItemQuantity(
      mockLocalCartItems[0].productId,
      mockLocalCartItems[0].color,
      mockLocalCartItems[0].size
    );

    expect(qty).toBe(mockLocalCartItems[0].quantity);
  });

  it("should match item by productId, color, AND size", () => {
    const itemRedM = { ...mockLocalCartItems[0], productId: 1, color: "Red", size: "M", quantity: 2 };
    const itemRedL = { ...mockLocalCartItems[0], productId: 1, color: "Red", size: "L", quantity: 5 };

    useCartStore.getState().setCart([itemRedM, itemRedL]);

    // Query specifically for Size M
    const qtyM = useCartStore.getState().getItemQuantity(1, "Red", "M");
    // Query specifically for Size L
    const qtyL = useCartStore.getState().getItemQuantity(1, "Red", "L");

    expect(qtyM).toBe(2);
    expect(qtyL).toBe(5);
  });
  
  it("should return empty array when localStorage is empty", () => {
    const cart = useCartStore.getState().getLocalCart();

    expect(cart).toEqual([]);
  });

  it("should add first item", () => {
    useCartStore.getState().addToLocalCart(mockLocalCartItems[0]);

    expect(useCartStore.getState().cart).toEqual([mockLocalCartItems[0]]);

    expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!)).toEqual([
      mockLocalCartItems[0],
    ]);
  });

  it("should increase quantity when item already exists", () => {
    useCartStore.getState().addToLocalCart(mockLocalCartItems[0]);
    useCartStore.getState().addToLocalCart(mockLocalCartItems[0]);

    expect(useCartStore.getState().cart[0].quantity).toBe(
      mockLocalCartItems[0].quantity + mockLocalCartItems[0].quantity,
    );
  });

  it("should create new item when size is different", () => {
    useCartStore.getState().addToLocalCart(mockLocalCartItems[0]);

    useCartStore.getState().addToLocalCart({
      ...mockLocalCartItems[0],
      size: "L",
    });

    expect(useCartStore.getState().cart).toHaveLength(2);
  });

  it("should update quantity", () => {
    useCartStore.getState().addToLocalCart(mockLocalCartItems[0]);

    useCartStore.getState().updateQuantity(1, "Red", "M", 5);

    expect(useCartStore.getState().cart[0].quantity).toBe(5);
  });
  it("should not exceed stockQuantity when adding items", () => {
    useCartStore.getState().addToLocalCart(mockLocalCartItems[0]); // qty = 2
    useCartStore.getState().addToLocalCart(mockLocalCartItems[0]); // qty = 4
    useCartStore.getState().addToLocalCart(mockLocalCartItems[0]); // tries to add 2 more (6 total)

    expect(useCartStore.getState().cart[0].quantity).toBe(5);
  });

  it("should not exceed stockQuantity when updating quantity directly", () => {
    useCartStore.getState().addToLocalCart(mockLocalCartItems[0]);

    useCartStore.getState().updateQuantity(1, "Red", "M", 10);

    expect(useCartStore.getState().cart[0].quantity).toBe(5);
  });

  it("should remove item from local cart", () => {
    useCartStore
      .getState()
      .setCart([mockLocalCartItems[0], mockLocalCartItems[1]]);

    useCartStore
      .getState()
      .removeFromLocalCart(
        mockLocalCartItems[0].productId,
        mockLocalCartItems[0].color,
        mockLocalCartItems[0].size,
      );

    expect(useCartStore.getState().cart).toHaveLength(1);
    expect(useCartStore.getState().cart[0].productId).toBe(
      mockLocalCartItems[1].productId,
    );
  });

  it("should not update other items", () => {
    useCartStore
      .getState()
      .setCart([mockLocalCartItems[0], mockLocalCartItems[1]]);

    useCartStore.getState().updateQuantity(1, "Red", "M", 5);

    expect(useCartStore.getState().cart).toEqual([
      {
        ...mockLocalCartItems[0],
        quantity: 5,
      },
      mockLocalCartItems[1],
    ]);
  });

  it("should return total quantity", () => {
    useCartStore.getState().addToLocalCart(mockLocalCartItems[0]);

    useCartStore.getState().addToLocalCart(mockLocalCartItems[1]);

    expect(useCartStore.getState().getTotalQuantity()).toBe(
      mockLocalCartItems[0].quantity + mockLocalCartItems[1].quantity,
    );
  });

  it("should clear local cart", () => {
    useCartStore.getState().addToLocalCart(mockLocalCartItems[0]);

    useCartStore.getState().clearLocalCart();

    expect(useCartStore.getState().cart).toEqual([]);

    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBeNull();
  });

  it("should get local cart", () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([mockLocalCartItems[0]]),
    );

    expect(useCartStore.getState().getLocalCart()).toEqual([
      mockLocalCartItems[0],
    ]);
  });
});
