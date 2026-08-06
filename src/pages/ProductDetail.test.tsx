// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { MemoryRouter, useParams, useSearchParams } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, test, vi } from "vitest";
import { ProductDetail } from "./ProductDetail";
import { useGetProduct } from "@/features/product/hooks/useProduct";
import { useAddToCart } from "@/features/cart/hooks/useCart";
import type { IProduct } from "@/features/product/services/product";
import userEvent from "@testing-library/user-event";
import { mockProducts } from "@/tests/mockProductData";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { mockUser } from "@/tests/mockUserData";

//stimulate matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useParams: vi.fn(),
    useSearchParams: vi.fn(),
    Navigate: ({ to, replace }: { to: string; replace?: boolean }) => (
      <div data-testid="navigate-redirect" data-replace={replace}>
        Redirected to {to}
      </div>
    ),
  };
});

vi.mock("@/features/product/hooks/useProduct", () => ({
  useGetProduct: vi.fn(),
}));

vi.mock("@/features/cart/hooks/useCart", () => ({
  useAddToCart: vi.fn(),
}));

vi.mock("@/components/Loading", () => ({
  Loading: () => (
    <div data-testid="loading-component">Mock Loading component</div>
  ),
}));

vi.mock("@/pages/ServerError", () => ({
  ServerError: ({ message }: { message?: string }) => (
    <div data-testid="server-error">{message || "Server is crashed"}</div>
  ),
}));

vi.mock("swiper/react", () => ({
  Swiper: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="swiper-container" className={className}>
      {children}
    </div>
  ),

  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));

vi.mock("swiper/modules", () => ({
  Pagination: vi.fn(),
  Autoplay: vi.fn(),
}));

describe("product detail component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const mockSetSearchParams = vi.fn();
  const mockHandleAddToCart = vi.fn();
  const setupMocks = ({
    id,
    searchParams = "color=Red",
    product = null,
    isGetProductPending = false,
    isErrorGetProduct = false,
    getProductError = null,
    isAddToCartPending = false,
    addToCartError = null,
  }: {
    id?: string;
    searchParams?: string;
    product?: IProduct | null;
    isGetProductPending?: boolean;
    isErrorGetProduct?: boolean;
    getProductError?: Error | null;
    isAddToCartPending?: boolean;
    addToCartError?: Error | null;
  }) => {
    vi.mocked(useParams).mockReturnValue({ id });

    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(searchParams),
      mockSetSearchParams,
    ]);

    vi.mocked(useGetProduct).mockReturnValue({
      data: product,
      isPending: isGetProductPending,
      isError: isErrorGetProduct,
      error: getProductError,
    } as unknown as ReturnType<typeof useGetProduct>);

    vi.mocked(useAddToCart).mockReturnValue({
      mutate: mockHandleAddToCart,
      isPending: isAddToCartPending,
      error: addToCartError,
    } as unknown as ReturnType<typeof useAddToCart>);

    return { product };
  };

  const invalidCases = [
    {
      id: undefined,
      searchParams: "color=Red",
      product: null,
      desc: "product id is undefined",
    },
    {
      id: "abc",
      searchParams: "color=Red",
      product: null,
      desc: "product id is not a number",
    },
    {
      id: "1",
      searchParams: "",
      product: null,
      desc: "color is null or undefined",
    },
    {
      id: "1",
      searchParams: "color=Red",
      product: null,
      desc: "product not found",
    },
  ];

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>,
    );

  test.each(invalidCases)(
    "should navigate to not-found page when $desc",
    ({ id, searchParams, product }) => {
      setupMocks({
        id,
        searchParams,
        product,
      });

      renderComponent();

      const redirectElement = screen.getByTestId("navigate-redirect");
      expect(redirectElement).toHaveAttribute("data-replace", "true");
    },
  );

  it("should return loading component when fetching product", () => {
    setupMocks({
      id: "1",
      isGetProductPending: true,
    });

    renderComponent();

    expect(screen.getByTestId("loading-component")).toBeInTheDocument();
  });

  it("should return server error component when an error occurred", () => {
    setupMocks({
      id: "1",
      isErrorGetProduct: true,
      getProductError: new Error("Something went wrong"),
    });

    renderComponent();

    const serverError = screen.getByTestId("server-error");

    expect(serverError).toBeInTheDocument();
    expect(serverError).toHaveTextContent("Something went wrong");
  });

  it("should display product details and related products on success", () => {
    const { product } = setupMocks({ id: "1", product: mockProducts[0] });

    renderComponent();

    const swiperContainers = screen.getAllByTestId("swiper-container");

    // The first Swiper is for main product images
    const mainImageSwiper = swiperContainers[0];
    const mainImages = within(mainImageSwiper).getAllByRole("img");
    expect(mainImages).toHaveLength(2);

    // The second Swiper is for related products
    const relatedProductSwiper = swiperContainers[1];
    const relatedCards =
      within(relatedProductSwiper).getAllByTestId("swiper-slide");
    expect(relatedCards).toHaveLength(product!.relatedProducts.length);
  });

  it("should display original price when no discount exists", () => {
    setupMocks({
      id: "1",
      product: mockProducts[1],
    });

    renderComponent();

    const discountPrice = screen.queryByTestId("discount-price");
    expect(discountPrice).not.toBeInTheDocument();
  });

  it("should display loading spinner when loading ", () => {
    setupMocks({
      id: "1",
      product: mockProducts[0],
      isAddToCartPending: true,
    });

    renderComponent();

    const spinnerAddToCart = screen.getByTestId("add-to-cart-loading");
    expect(spinnerAddToCart).toBeInTheDocument();
  });

  it("should display message if an error occurred when add to cart", () => {
    setupMocks({
      id: "1",
      product: mockProducts[0],
      addToCartError: new Error("Something went wrong"),
    });

    renderComponent();

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("should update color in search params when a color is clicked", async () => {
    setupMocks({
      id: "1",
      product: mockProducts[0],
    });

    renderComponent();

    const user = userEvent.setup();

    const blueBtn = screen.getByRole("button", { name: /Blue/i });
    await user.click(blueBtn);
    expect(mockSetSearchParams).toHaveBeenCalled();
    const colorSearchParams = mockSetSearchParams.mock.calls[0][0];

    expect(colorSearchParams.get("color")).toBe("Blue");
    expect(colorSearchParams.get("size")).toBeNull();
  });

  it("should update size in search params when a size is clicked", async () => {
    setupMocks({
      id: "1",
      product: mockProducts[0],
    });

    renderComponent();

    const user = userEvent.setup();

    const sizeSBtn = screen.getByRole("button", { name: "M" });
    await user.click(sizeSBtn);
    expect(mockSetSearchParams).toHaveBeenCalled();
    const sizeSearchParams = mockSetSearchParams.mock.calls[0][0];
    expect(sizeSearchParams.get("size")).toBe("M");
  });

  it("should call handleAddToCart with local cart items when clicked", async () => {
    setupMocks({
      id: "1",
      product: mockProducts[0],
      searchParams: "color=Blue&size=M",
    });

    renderComponent();

    const user = userEvent.setup();

    const addToCartBtn = screen.getByRole("button", { name: /Add to cart/i });
    await user.click(addToCartBtn);

    expect(mockHandleAddToCart).toHaveBeenCalled();
  });

  it("should call handleAddToCart with db cart item when clicked", async () => {
    setupMocks({
      id: "1",
      product: mockProducts[0],
      searchParams: "color=Blue&size=M",
    });

    useAuthStore.getState().setAuth(mockUser, "token")

    renderComponent();

    const user = userEvent.setup();

    const addToCartBtn = screen.getByRole("button", { name: /Add to cart/i });
    await user.click(addToCartBtn);

    expect(mockHandleAddToCart).toHaveBeenCalled();
  });

  it("should display stock quantity 0 when selected color or selected size not match with variants", () => {
    setupMocks({
      id: "1",
      product: mockProducts[0],
      searchParams: "color=Pink&size=40",
    });

    renderComponent();

    const stockQuantity = screen.getByTestId("stock-quantity");
    expect(stockQuantity).toHaveTextContent("0");
  });

  it("should not call handleAddToCart when size is not selected", () => {
    setupMocks({
      id: "1",
      product: mockProducts[0],
      searchParams: "color=Red",
    });

    renderComponent();

    const addToCartBtn = screen.getByRole("button", { name: /Add to cart/i });

    (addToCartBtn as HTMLButtonElement).disabled = false;
    fireEvent.click(addToCartBtn);

    expect(mockHandleAddToCart).not.toHaveBeenCalled();
  });
});
