// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockProductList } from "@/tests/mock/mockData";
import { cleanup, render, screen } from "@testing-library/react";
import { ProductCard } from "./ProductCard";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("ProductCart component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should display discount price when product is on sale", () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProductList[0]} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "alt",
      mockProductList[0].name,
    );

    expect(
      screen.getByText(`$${mockProductList[0].discountPrice}`),
    ).toBeInTheDocument();
  });

  it("should not display discount price when product is not on sale", () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProductList[1]} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "alt",
      mockProductList[1].name,
    );
  });

  it("should display the active image", () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProductList[0]} />
      </MemoryRouter>,
    );

    const defaultColor = mockProductList[0].variants[0].color;

    const activeImg = mockProductList[0].images.find(
      (img) => img.color === defaultColor && img.isPrimary,
    );

    expect(
      screen.getByRole("img", { name: mockProductList[0].name }),
    ).toHaveAttribute("src", activeImg?.imageUrl);
  });

  it("should change the active image when new color is selected", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ProductCard product={mockProductList[0]} />
      </MemoryRouter>,
    );

    const targetColor = "Blue";
    const targetImg = mockProductList[0].images.find(
      (img) => img.color === targetColor,
    );

    const colorBtn = screen.getByRole("button", { name: targetColor });

    await user.click(colorBtn);

    expect(
      screen.getByRole("img", { name: mockProductList[0].name }),
    ).toHaveAttribute("src", targetImg?.imageUrl);
  });

  it("should display the image index 0 when all images primary is false", async () => {
    const mockProduct = {
      ...mockProductList[0],
      variants: [{
        id: "fake-variant-1",
          color: "WEIRD_NEON_GREEN", // fake color
          size: "S",
          stockQuantity: 10,
          sku: "TEST-SKU",
      }]
    };

    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("img", { name: mockProductList[0].name }),
    ).toHaveAttribute("src", mockProductList[0].images[0].imageUrl);
  });
});
