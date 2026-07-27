// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CartToast, type CartToastProps } from "./CartToast";
import { mockProductList } from "@/tests/mock/mockData";
import { cleanup, render, screen } from "@testing-library/react";

describe("Cart Toast", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });
  const mockProps = {
    product: mockProductList[1],
    color: "Red",
    size: "M",
  };

  it("should return when product is null", () => {
    const propsWithNullProduct = { ...mockProps, product: null };

    render(
      <CartToast {...(propsWithNullProduct as unknown as CartToastProps)} />,
    );

    expect(
      screen.queryByText("Added to cart successfully"),
    ).not.toBeInTheDocument();
  });

  it("should return when color is null", () => {
    const propsWithNullColor = { ...mockProps, color: null };

    render(
      <CartToast {...(propsWithNullColor as unknown as CartToastProps)} />,
    );

    expect(
      screen.queryByText("Added to cart successfully"),
    ).not.toBeInTheDocument();
  });

  it("should return when size is null", () => {
    const propsWithNullSize = { ...mockProps, size: null };

    render(<CartToast {...(propsWithNullSize as unknown as CartToastProps)} />);

    expect(
      screen.queryByText("Added to cart successfully"),
    ).not.toBeInTheDocument();
  });

  it("should render all element on success", () => {
    render(<CartToast {...mockProps} />);

    expect(screen.getByText("Added to cart successfully")).toBeInTheDocument();
  });

  it("should display discount price for sale product", () => {
    const propsWithSaleProduct = { ...mockProps, product: mockProductList[0] };

    render(<CartToast {...propsWithSaleProduct} />);

    expect(screen.getByText("Added to cart successfully")).toBeInTheDocument();
  });
});
