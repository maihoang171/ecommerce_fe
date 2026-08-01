//@vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProductSizeSelector } from "./ProductSizeSelector";
import { mockProductList } from "@/tests/mockData";
import userEvent from "@testing-library/user-event";
import type { IProduct } from "@/features/product/services/product";

describe("product size selector component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const mockOnSelectSize = vi.fn();
  it("should return null when product variant is undefined", () => {
    const emptyProduct = {} as IProduct;
    const { container } = render(
      <ProductSizeSelector
        product={emptyProduct}
        selectedColor={"Red"}
        selectedSize={"S"}
        onSelectSize={vi.fn()}
      />,
    );

    expect(container.firstChild).toBe(null);
  });
  it("should display all product sizes with selected color", () => {
    render(
      <ProductSizeSelector
        product={mockProductList[0]}
        selectedColor={mockProductList[0].variants[0].color}
        selectedSize={mockProductList[0].variants[0].size}
        onSelectSize={mockOnSelectSize}
      />,
    );
    const btns = screen.getAllByRole("button");
    expect(btns).toHaveLength(3);
  });

  it("should call onSelectSize with correct size when clicked and display correct class for selected size", async () => {
    const { rerender } = render(
      <ProductSizeSelector
        product={mockProductList[0]}
        selectedColor={"Red"}
        selectedSize={"M"}
        onSelectSize={(size) => {
          mockOnSelectSize(size);
          rerender(
            <ProductSizeSelector
              product={mockProductList[0]}
              selectedColor={"Red"}
              selectedSize={size}
              onSelectSize={mockOnSelectSize}
            />,
          );
        }}
      />,
    );

    const user = userEvent.setup();
    const sizeLBtn = screen.getByRole("button", { name: /L/i });

    await user.click(sizeLBtn);
    expect(mockOnSelectSize).toHaveBeenCalledWith("L");

    expect(sizeLBtn).toHaveClass("bg-black");
  });
});
