// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ProductColorSelector } from "./ProductColorSelector";
import userEvent from "@testing-library/user-event";
import type { IProduct } from "../services/product";
import { mockProducts } from "@/tests/mockProductData";

describe("ProductColorSelector component", () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should return null when product variant is undefined", () => {
    const emptyProduct = {} as IProduct;
    const { container } = render(
      <ProductColorSelector
        product={emptyProduct}
        selectedColor={"Red"}
        onSelectColor={vi.fn()}
      />,
    );

    expect(container.firstChild).toBe(null);
  });
  const mockOnSelectColor = vi.fn();

  it("should render exactly one button per color", () => {
    render(
      <ProductColorSelector
        product={mockProducts[0]}
        selectedColor={mockProducts[0].variants[0].color}
        onSelectColor={mockOnSelectColor}
      />,
    );

    const btns = screen.getAllByRole("button");
    expect(btns).toHaveLength(2);
  });

  it("should call onSelector with the correct color name when clicked", async () => {
    render(
      <ProductColorSelector
        product={mockProducts[0]}
        selectedColor={mockProducts[0].variants[0].color} // Red color
        onSelectColor={mockOnSelectColor}
      />,
    );

    const user = userEvent.setup();

    const blueBtn = screen.getByRole("button", { name: /Blue/i });

    await user.click(blueBtn);

    expect(mockOnSelectColor).toHaveBeenCalledTimes(1);
    expect(mockOnSelectColor).toHaveBeenCalledWith("Blue");
  });
});
