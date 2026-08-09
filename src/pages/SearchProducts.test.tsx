//@vitest-environment jsdom
import { useSearchProducts } from "@/features/product/hooks/useProduct";
import type { IProduct } from "@/features/product/services/product";
import { mockProducts } from "@/tests/mockProductData";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchProduct } from "./SearchProducts";
import { MemoryRouter, useSearchParams } from "react-router-dom";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

vi.mock("@/features/product/hooks/useProduct", () => ({
  useSearchProducts: vi.fn(),
}));

vi.mock("@/components/Loading", () => ({
  Loading: () => <div data-testid="mock-loading">mock loading component</div>,
}));

vi.mock("@/features/product/components/ProductGrid", () => ({
  ProductGrid: ({ emptyMessage }: { emptyMessage?: string }) => (
    <div data-testid="mock-product-grid">
      <span>{emptyMessage}</span>
    </div>
  ),
}));
describe("SearchProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupMocks = ({
    data = mockProducts,
    isPending = false,
    query = "shirt",
  }: {
    data?: IProduct[];
    isPending?: boolean;
    query?: string;
  }) => {
    vi.mocked(useSearchProducts).mockReturnValue({
      data,
      isPending,
    } as ReturnType<typeof useSearchProducts>);

    const searchParams = new URLSearchParams(query ? { q: query } : {});
    vi.mocked(useSearchParams).mockReturnValue([searchParams, vi.fn()]);
  };

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <SearchProduct />
      </MemoryRouter>,
    );
  };

  it("should fallback empty string when query params is missing", () => {
    setupMocks({ query: "" });

    renderComponent();

    expect(
      screen.getByText("No products found matching !"),
    ).toBeInTheDocument();
  });

  it("should return loading component when pending for fetching data", () => {
    setupMocks({ isPending: true });

    renderComponent();

    expect(screen.getByTestId("mock-loading")).toBeInTheDocument();
  });

  it("should display product grid on success", () => {
    setupMocks({});
    renderComponent();

    expect(screen.getAllByTestId("mock-product-grid")).toHaveLength(
      mockProducts.length,
    );
  });
});
