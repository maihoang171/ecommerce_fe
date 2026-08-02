// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { LOCAL_STORAGE_KEY, useCartStore } from "./useCartStore";

describe("cart store", () => {
  beforeEach(() => {
    localStorage.clear();

    useCartStore.setState({
      cart: [],
    });
  });

  const item = {
    productId: 1,
    color: "Red",
    size: "M",
    quantity: 1,
  };

  it("should get cart from localStorage", () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([item]));

    const cart = useCartStore.getState().getLocalCart();

    expect(cart).toEqual([item]);
  });

  it("should return empty array when localStorage is empty", () => {
  const cart = useCartStore.getState().getLocalCart();

  expect(cart).toEqual([]);
});

  it("should add first item", () => {
    useCartStore.getState().addToLocalCart(item);

    expect(useCartStore.getState().cart).toEqual([item]);

    expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!)).toEqual([
      item,
    ]);
  });

  it("should increase quantity when item already exists", () => {
    useCartStore.getState().addToLocalCart(item);
    useCartStore.getState().addToLocalCart(item);

    expect(useCartStore.getState().cart[0].quantity).toBe(2);
  });

  it("should not exceed stock limit", () => {
    useCartStore.getState().addToLocalCart(item, 2);
    useCartStore.getState().addToLocalCart(item, 2);
    useCartStore.getState().addToLocalCart(item, 2);

    expect(useCartStore.getState().cart[0].quantity).toBe(2);
  });

  it("should create new item when size is different", () => {
    useCartStore.getState().addToLocalCart(item);

    useCartStore.getState().addToLocalCart({
      ...item,
      size: "L",
    });

    expect(useCartStore.getState().cart).toHaveLength(2);
  });

  it("should update quantity", () => {
    useCartStore.getState().addToLocalCart(item);

    useCartStore.getState().updateQuantity(1, "Red", "M", 5);

    expect(useCartStore.getState().cart[0].quantity).toBe(5);
  });

  it("should not update other items", () => {
    const secondItem = {
      productId: 2,
      color: "Blue",
      size: "L",
      quantity: 3,
    };

    useCartStore.getState().setCart([item, secondItem]);

    useCartStore.getState().updateQuantity(1, "Red", "M", 5);

    expect(useCartStore.getState().cart).toEqual([
      {
        ...item,
        quantity: 5,
      },
      secondItem,
    ]);
  });

  it("should return total quantity", () => {
    useCartStore.getState().addToLocalCart(item);

    useCartStore.getState().addToLocalCart({
      productId: 2,
      color: "Blue",
      size: "L",
      quantity: 3,
    });

    expect(useCartStore.getState().getTotalQuantity()).toBe(4);
  });

  it("should clear local cart", () => {
    useCartStore.getState().addToLocalCart(item);

    useCartStore.getState().clearLocalCart();

    expect(useCartStore.getState().cart).toEqual([]);

    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBeNull();
  });

  it("should get local cart", () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([item]));

    expect(useCartStore.getState().getLocalCart()).toEqual([item]);
  });
});
