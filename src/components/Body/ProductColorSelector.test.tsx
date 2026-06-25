// // @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { mockProductList } from "@/tests/mock/mockData";
import { cleanup, render, screen } from "@testing-library/react";
import { ProductColorSelector } from "./ProductColorSelector";
import userEvent from "@testing-library/user-event";

describe("ProductColorSelector component", () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const mockOnSelectColor = vi.fn();
  it("should render exactly one button per color", () => {
    render(
      <ProductColorSelector
        product={mockProductList[0]}
        selectedColor={mockProductList[0].variants[0].color}
        onSelectColor={mockOnSelectColor}
      />,
    );

    const btns = screen.getAllByRole("button");
    expect(btns).toHaveLength(2);
  });

  it("should call onSelector with the correct color name when clicked", async () => {
    render(
      <ProductColorSelector
        product={mockProductList[0]}
        selectedColor={mockProductList[0].variants[0].color} // Red color
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
