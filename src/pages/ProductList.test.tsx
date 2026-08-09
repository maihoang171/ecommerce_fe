// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, vi, it, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ProductList } from "./ProductList";
import { useGetProductList } from "@/features/product/hooks/useProduct";
import { useGetCategoryList } from "@/features/category/hooks/useCategory";
import type { IProduct } from "@/features/product/services/product";
import { mockCategoryList } from "@/tests/mockCategoryListData";
import type { IParentCategory } from "@/features/category/services/category";
import { mockProducts } from "@/tests/mockProductData";

vi.mock("@/features/product/hooks/useProduct", () => ({
  useGetProductList: vi.fn(),
}));

vi.mock("@/features/category/hooks/useCategory", () => ({
  useGetCategoryList: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  };
});

vi.mock("@/components/Loading", () => ({
  Loading: () => <div data-testid="loading-spinner">Loading...</div>,
}));

vi.mock("@/features/product/components/ProductCard", () => ({
  ProductCard: ({ product }: { product: IProduct }) => (
    <div data-testid="product-card">{product.name}</div>
  ),
}));

vi.mock("@/pages/ServerError", () => ({
  ServerError: ({ message }: { message: string }) => (
    <div data-testid="server-error">{message}</div>
  ),
}));

describe("ProductList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGetCategoryList).mockReturnValue({
      data: mockCategoryList,
    } as ReturnType<typeof useGetCategoryList>);
  });

  afterEach(() => {
    cleanup();
  });

  const setupMocks = ({
    categoriesData = mockCategoryList,
    productsData = null,
    isGetCategoryPending = false,
    isGetProductsPending = false,
    isGetProductsError = false,
    getProductsError = null,
    parentSlug = "women",
    childSlug = "dresses",
  }: {
    categoriesData?: IParentCategory[] | null;
    productsData?: IProduct[] | null;
    isGetCategoryPending?: boolean;
    isGetProductsPending?: boolean;
    isGetProductsError?: boolean;
    getProductsError?: Error | null;
    parentSlug?: string | null;
    childSlug?: string | null;
  } = {}) => {
    vi.mocked(mockUseParams).mockReturnValue({ parentSlug, childSlug });

    vi.mocked(useGetCategoryList).mockReturnValue({
      data: categoriesData,
      isPending: isGetCategoryPending,
    } as unknown as ReturnType<typeof useGetCategoryList>);

    vi.mocked(useGetProductList).mockReturnValue({
      data: productsData,
      isPending: isGetProductsPending,
      isError: isGetProductsError,
      error: getProductsError,
    } as unknown as ReturnType<typeof useGetProductList>);
  };

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>,
    );
  };

  it("should render loading state correctly", () => {
    setupMocks({ isGetProductsPending: true });

    renderComponent();

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should render ServerError when an error occurs", () => {
    setupMocks({
      isGetProductsError: true,
      getProductsError: new Error("Failed to fetch products"),
    });

    renderComponent();

    const errorEl = screen.getByTestId("server-error");
    expect(errorEl).toBeInTheDocument();
    expect(errorEl).toHaveTextContent("Failed to fetch products");
  });

  it("should render products and child category navigation tabs successfully", async () => {
    setupMocks({ productsData: mockProducts });

    renderComponent();

    const user = userEvent.setup();

    // Check product cards count and text
    expect(screen.getAllByTestId("product-card")).toHaveLength(2);
    expect(screen.getByText("Evening Slip Dress")).toBeInTheDocument();

    // Check sub-category navigation click
    const topsButton = screen.getByRole("button", { name: /Tops/i });
    await user.click(topsButton);

    expect(mockNavigate).toHaveBeenCalledWith("/women/tops");
  });


  it("should fallback empty string and navigate to not found page when parentSlug is null or undefined", () => {
    setupMocks({ categoriesData: mockCategoryList, parentSlug: null });

    renderComponent();

    expect(mockNavigate).toHaveBeenCalledWith("/not-found", { replace: true });
  });

  it("should fallback empty array and return not found page when category is null or undefined", () => {
    setupMocks({ categoriesData: null });

    renderComponent();

    expect(mockNavigate).toHaveBeenCalledWith("/not-found", { replace: true });
  });

  it("should not call navigate when category pending is true", () => {
    setupMocks({ isGetCategoryPending: true });

    renderComponent();

    expect(mockNavigate).not.toHaveBeenCalledWith("/not-found", {
      replace: true,
    });
  });
});
