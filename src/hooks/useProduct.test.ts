//@vitest-environment jsdom
import { beforeEach, describe, vi, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";

import {
  getProductListByCategorySlugService,
  getProductService,
} from "@/services/product";
import { useGetProduct, useGetProductList } from "./useProduct";
import { extractErrorMsg } from "@/utils/error";
import { useProductStore } from "@/stores/useProductStore";
import {
  mockProductListResponse,
  mockProductResponse,
} from "@/tests/mock/mockResponse";

vi.mock("@/services/product", () => ({
  getProductListByCategorySlugService: vi.fn(),
  getProductService: vi.fn(),
}));

vi.mock("@/stores/useProductStore", () => ({
  useProductStore: vi.fn(),
}));

vi.mock("@/utils/error", () => ({
  extractErrorMsg: vi.fn(),
}));

describe("useGetProductList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const mockParentSlug = "parentSlug";
  const mockChildSlug = "childSlug";

  const mockSetProductList = vi.fn();

  vi.mocked(useProductStore).mockReturnValue({
    setProductList: mockSetProductList,
  });

  it("should throw an error when the product list is not found", async () => {
    const mockRes = {
      success: false,
      data: null,
    };

    vi.mocked(getProductListByCategorySlugService).mockResolvedValue(mockRes);
    vi.mocked(extractErrorMsg).mockReturnValue("Product list not found");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useGetProductList());
    await act(async () => {
      await result.current.handleGetProductList(mockParentSlug, mockChildSlug);
    });

    expect(mockSetProductList).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to fetch product list: Product list not found",
    );
  });

  it("should receive data from API and save to product list store", async () => {
    vi.mocked(getProductListByCategorySlugService).mockResolvedValue(
      mockProductListResponse,
    );

    const { result } = renderHook(() => useGetProductList());
    await act(async () => {
      await result.current.handleGetProductList(mockParentSlug, mockChildSlug);
    });

    expect(mockSetProductList).toHaveBeenCalledWith(
      mockProductListResponse.data,
    );
  });
});

describe("useGetProduct", () => {
  const mockProductId = "1";
  const mockCategoryId = "5";

  const mockSetProduct = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useProductStore).mockReturnValue({
      setProduct: mockSetProduct,
    });
  });

  it("should throw error when product is not found", async () => {
    const mockRes = { success: false, data: null };
    const errorMsg = "Product not found";
    vi.mocked(getProductService).mockResolvedValue(mockRes);
    vi.mocked(extractErrorMsg).mockReturnValue(errorMsg);

    const { result } = renderHook(() => useGetProduct());

    let res;
    await act(async () => {
      res = await result.current.handleGetProduct(
        mockProductId,
        mockCategoryId,
      );
    });

    expect(mockSetProduct).not.toHaveBeenCalled();
    expect(res).toBe(false);
  });

  it("should set errMsg null, set product to store and return true on success", async () => {
    vi.mocked(getProductService).mockResolvedValue(mockProductResponse);

    const { result } = renderHook(() => useGetProduct());

    await result.current.handleGetProduct(mockProductId, mockCategoryId);

    expect(result.current.errMsg).toBe(null);
    expect(mockSetProduct).toHaveBeenCalledWith(mockProductResponse.data);
  });
});
