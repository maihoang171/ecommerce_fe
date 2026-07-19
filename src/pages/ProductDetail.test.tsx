// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, useParams, useSearchParams } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, test, vi } from "vitest";
import { mockProductList } from "@/tests/mock/mockData";
import { useProductStore } from "@/stores/useProductStore";
import { ProductDetail } from "./ProductDetail";
import { useGetProduct } from "@/hooks/useProduct";
import userEvent from "@testing-library/user-event";
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

const mockNavigate = vi.fn();
vi.mock(import("react-router-dom"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(),
    useSearchParams: vi.fn(),
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../stores/useProductStore", () => ({
  useProductStore: vi.fn(),
}));

vi.mock("@/hooks/useProduct", () => ({
  useGetProduct: vi.fn(),
}));

vi.mock("@/components/Body/Loading", () => ({
  Loading: () => (
    <div data-testid="loading-component">Mock Loading component</div>
  ),
}));

describe("product detail component", () => {
  const mockSetSearchParams = vi.fn();
  const mockSetProduct = vi.fn();
  const mockHandleGetProduct = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const invalidCases = [
    {
      id: undefined,
      searchParams: "color=red",
      desc: "product id is undefined",
    },
    {
      id: "abc",
      searchParams: "color=red",
      desc: "product id is not a number",
    },
  ];
  test.each(invalidCases)(
    "should navigate to not-found page when $desc",
    ({ id, searchParams }) => {
      vi.mocked(useParams).mockReturnValue({ id });

      vi.mocked(useProductStore).mockReturnValue({
        product: mockProductList[0],
        productList: mockProductList,
        setProduct: mockSetProduct,
      });

      vi.mocked(useSearchParams).mockReturnValue([
        new URLSearchParams(searchParams),
        mockSetSearchParams,
      ]);

      vi.mocked(useGetProduct).mockReturnValue({
        handleGetProduct: mockHandleGetProduct,
        isLoadingGetProduct: false,
        errMsg: null,
      });

      render(
        <MemoryRouter>
          <ProductDetail />
        </MemoryRouter>,
      );

      expect(mockNavigate).toHaveBeenCalledWith("/not-found", {
        replace: true,
      });
    },
  );

  it("should return loading component when isLoading", () => {
    vi.mocked(useParams).mockReturnValue({ id: "1" });

    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams("color=Red"),
      mockSetSearchParams,
    ]);

    vi.mocked(useProductStore).mockReturnValue({
      product: mockProductList[0],
      productList: mockProductList,
      setProduct: vi.fn(),
    });

    vi.mocked(useGetProduct).mockReturnValue({
      handleGetProduct: vi.fn(),
      isLoadingGetProduct: true,
      errMsg: null,
    });

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("loading-component")).toBeInTheDocument();
  });

  it("should display correct stock quantity when a size is selected", async () => {
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(useProductStore).mockReturnValue({
      product: mockProductList[0],
      productList: mockProductList,
      setProduct: mockSetProduct,
    });
    vi.mocked(useGetProduct).mockReturnValue({
      handleGetProduct: mockHandleGetProduct,
      isLoadingGetProduct: false,
      errMsg: null,
    });
    const searchParams = "categoryId=4&color=Red&size=M";
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(searchParams),
      mockSetSearchParams,
    ]);

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Only 5 items left")).toBeInTheDocument();
  });

  it("should display 0 when the size is invalid", async () => {
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(useProductStore).mockReturnValue({
      product: mockProductList[0],
      productList: mockProductList,
      setProduct: mockSetProduct,
    });
    vi.mocked(useGetProduct).mockReturnValue({
      handleGetProduct: mockHandleGetProduct,
      isLoadingGetProduct: false,
      errMsg: null,
    });
    const searchParams = "categoryId=4&color=Red&size=ABC"; //invalid size
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(searchParams),
      mockSetSearchParams,
    ]);

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Only 0 items left")).toBeInTheDocument();
  });

  it("should display only original price when no discount exists", () => {
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(useProductStore).mockReturnValue({
      product: mockProductList[1],
      productList: mockProductList,
      setProduct: mockSetProduct,
    });
    vi.mocked(useGetProduct).mockReturnValue({
      handleGetProduct: mockHandleGetProduct,
      isLoadingGetProduct: false,
      errMsg: null,
    });
    const searchParams = "categoryId=4&color=Red";
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(searchParams),
      mockSetSearchParams,
    ]);

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("original-price")).toBeInTheDocument();
    expect(screen.queryByTestId("original-price")).not.toHaveClass(
      "line-through",
    );
  });

  it("should setSearchParams for color when clicked", async () => {
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(useProductStore).mockReturnValue({
      product: mockProductList[0],
      productList: mockProductList,
      setProduct: mockSetProduct,
    });
    vi.mocked(useGetProduct).mockReturnValue({
      handleGetProduct: mockHandleGetProduct,
      isLoadingGetProduct: false,
      errMsg: null,
    });

    const searchParams = "categoryId=4&color=Red";
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(searchParams),
      mockSetSearchParams,
    ]);

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>,
    );

    const blueBtn = screen.getAllByRole("button", { name: /Blue/i })[0];

    await user.click(blueBtn);
    expect(mockSetSearchParams).toHaveBeenCalled();

    const calledParams = mockSetSearchParams.mock.calls[0][0];
    expect(calledParams.get("categoryId")).toBe("4");
    expect(calledParams.get("color")).toBe("Blue");
  });

  it("should setSearchParams for size when clicked", async () => {
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(useProductStore).mockReturnValue({
      product: mockProductList[0],
      productList: mockProductList,
      setProduct: mockSetProduct,
    });
    vi.mocked(useGetProduct).mockReturnValue({
      handleGetProduct: mockHandleGetProduct,
      isLoadingGetProduct: false,
      errMsg: null,
    });

    const user = userEvent.setup();
    const searchParams = "categoryId=4&color=Red";
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(searchParams),
      mockSetSearchParams,
    ]);

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>,
    );

    const sizeMBtn = screen.getByRole("button", { name: /^M$/i });

    await user.click(sizeMBtn);
    screen.debug(sizeMBtn);
    expect(mockSetSearchParams).toHaveBeenCalled();

    const calledParams = mockSetSearchParams.mock.calls[0][0];
    expect(calledParams.get("size")).toBe("M");
  });

  it("should set selectedColor is empty string when it is null or undefined", () => {
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(useProductStore).mockReturnValue({
      product: mockProductList[0],
      productList: mockProductList,
      setProduct: mockSetProduct,
    });
    vi.mocked(useGetProduct).mockReturnValue({
      handleGetProduct: mockHandleGetProduct,
      isLoadingGetProduct: false,
      errMsg: null,
    });

    const searchParams = "categoryId=4";
    const mockSearchParams = new URLSearchParams(searchParams);
    vi.mocked(useSearchParams).mockReturnValue([
      mockSearchParams,
      mockSetSearchParams,
    ]);

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>,
    );
    expect(mockSearchParams.get("color")).toBe(null);
  });
});
