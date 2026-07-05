// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useProductStore } from "@/stores/useProductStore";
import { cleanup, render, screen } from "@testing-library/react";
import { ProductList } from "./ProductList";
import { useCategoryStore } from "@/stores/useCategoryStore";
import userEvent from "@testing-library/user-event";
import { mockProductList, mockCategoryList } from "@/tests/mock/mockData";
import { useGetProductList } from "@/hooks/useProduct";

vi.mock("@/stores/useProductStore", () => ({
  useProductStore: vi.fn(),
}));

vi.mock("@/hooks/useProduct", () => ({
  useGetProductList: vi.fn(),
}));
const useGetProductListMock = vi.mocked(useGetProductList);

vi.mock("@/stores/useCategoryStore", () => ({
  useCategoryStore: vi.fn(),
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

vi.mock("@/components/Body/ProductCard", () => ({
  ProductCard: () => (
    <div data-testid="mock-product-detail-component">
      Fake Product Detail Component
    </div>
  ),
}));

vi.mock("@/components/Body/Loading", () => ({
  Loading: () => (
    <div data-testid="loading-spinner">Mock Loading component</div>
  ),
}));

describe("ProductList", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useGetProductListMock.mockReturnValue({
      handleGetProductList: vi.fn(),
      isLoading: false,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("should display message if no products has found", async () => {
    vi.mocked(useProductStore).mockReturnValue({ productList: [] });

    vi.mocked(mockUseParams).mockReturnValue({
      parentSlug: "mockParentSlug",
    });

    vi.mocked(useCategoryStore).mockReturnValue({
      categoryList: mockCategoryList,
      activeParentCategory: mockCategoryList[0],
      activeChildCategory: mockCategoryList[0].children[0],
      setActiveChildCategory: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>,
    );

    expect(screen.getByText(/No products has found/i)).toBeInTheDocument();
  });

  it("should navigate to not found page when the parent slug is undefined", () => {
    vi.mocked(useProductStore).mockReturnValue({ productList: [] });

    vi.mocked(mockUseParams).mockReturnValue({
      parentSlug: undefined,
      childSlug: "dresses",
    });

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>,
    );

    expect(mockNavigate).toHaveBeenCalledWith("/not-found", { replace: true });
  });

  it("should navigate to not found page when the child slug is undefined", () => {
    vi.mocked(useProductStore).mockReturnValue({ productList: [] });
    vi.mocked(mockUseParams).mockReturnValue({
      parentSlug: "women",
      childSlug: undefined,
    });

    vi.mocked(useCategoryStore).mockReturnValue({
      categoryList: mockCategoryList,
      activeParentCategory: mockCategoryList[0],
      activeChildCategory: mockCategoryList[0].children[0],
      setActiveChildCategory: vi.fn(),
      setActiveParentCategory: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>,
    );
    expect(mockNavigate).toHaveBeenCalledWith("/not-found", { replace: true });
  });

  it("should set active child category and navigate to exact link on click", async () => {
    vi.mocked(useProductStore).mockReturnValue({
      productList: mockProductList,
    });

    vi.mocked(mockUseParams).mockReturnValue({
      parentSlug: "women",
      childSlug: "dresses",
    });

    const mockSetActiveChildCategory = vi.fn();
    vi.mocked(useCategoryStore).mockReturnValue({
      categoryList: mockCategoryList,
      activeParentCategory: mockCategoryList[0],
      activeChildCategory: mockCategoryList[0].children[0],
      setActiveChildCategory: mockSetActiveChildCategory,
      setActiveParentCategory: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    const childCategoryBtn = screen.getByRole("button", { name: /tops/i });

    await user.click(childCategoryBtn);

    expect(mockSetActiveChildCategory).toHaveBeenCalledWith(
      mockCategoryList[0].children[1],
    );
    expect(mockNavigate).toHaveBeenCalledWith(`/women/tops`);
  });

  it("should render all elements and proper product list on success", () => {
    vi.mocked(useProductStore).mockReturnValue({
      productList: mockProductList,
    });

    vi.mocked(mockUseParams).mockReturnValue({
      parentSlug: "women",
      childSlug: "dresses",
    });

    vi.mocked(useCategoryStore).mockReturnValue({
      categoryList: mockCategoryList,
      activeParentCategory: mockCategoryList[0],
      activeChildCategory: mockCategoryList[0].children[0],
      setActiveChildCategory: vi.fn(),
      setActiveParentCategory: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>,
    );

    expect(screen.getByText(/2 products/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("mock-product-cart-component")).toHaveLength(
      2,
    );
  });

  it("should do nothing when the category length equal 0", () => {
    vi.mocked(useProductStore).mockReturnValue({ productList: [] });

    vi.mocked(mockUseParams).mockReturnValue({
      parentSlug: "women",
      childSlug: "dresses",
    });

    const mockSetActiveParentCategory = vi.fn();
    vi.mocked(useCategoryStore).mockReturnValue({
      categoryList: [],
      activeParentCategory: undefined,
      activeChildCategory: undefined,
      setActiveChildCategory: vi.fn(),
      setActiveParentCategory: mockSetActiveParentCategory,
    });

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>,
    );

    expect(mockSetActiveParentCategory).not.toHaveBeenCalled();
  });

  it("should display loading spinner when isLoading is true", () => {
    useGetProductListMock.mockReturnValue({
      handleGetProductList: vi.fn(),
      isLoading: true,
    });

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
});
