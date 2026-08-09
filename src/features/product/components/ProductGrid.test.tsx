//@vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductGrid } from "./ProductGrid";
import { mockProducts } from "@/tests/mockProductData";

vi.mock("./ProductCard", () => ({
  ProductCard: () => (
    <div data-testid="mock-product-cart">mock product card</div>
  ),
}));

vi.mock("@/components/Loading", () => ({
  Loading: () => <div data-testid="mock-loading">mock loading</div>,
}));

describe("ProductGrid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display all elements on success", () => {
    render(<ProductGrid products={mockProducts} />);

    expect(
      screen.getByText(`${mockProducts.length} items`),
    ).toBeInTheDocument();

    expect(screen.getAllByTestId("mock-product-cart")).toHaveLength(
      mockProducts.length,
    );
  });

  it("should show Loading component when fetching data", () => {
    render(<ProductGrid isPending={true} />);

    expect(screen.getByTestId("mock-loading")).toBeInTheDocument();
  });

  it("should show empty message when no product found", () => {
    render(<ProductGrid products={[]} />);

    expect(screen.getByText("No product found!")).toBeInTheDocument();
  });
});
