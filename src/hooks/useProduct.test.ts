//@vitest-environment jsdom
import { beforeEach, describe, vi, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { getProductListByCategorySlugService } from "@/services/product";
import { useGetProductList } from "./useProduct";
import { extractErrorMsg } from "@/utils/error";
import { useProductStore } from "@/stores/useProductStore";
import { mockProductListResponse } from "@/tests/mock/mockResponse";

vi.mock("@/services/product", () => ({
  getProductListByCategorySlugService: vi.fn(),
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

  it("should throw an error and toast message when the product list is not found", async () => {
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
    expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch product list: Product list not found",);
  });

  it("should receive data from API and save to product list store", async () => {
    vi.mocked(getProductListByCategorySlugService).mockResolvedValue(mockProductListResponse);

    const { result } = renderHook(() => useGetProductList());
    await act(async () => {
      await result.current.handleGetProductList(mockParentSlug, mockChildSlug);
    });

    expect(mockSetProductList).toHaveBeenCalledWith(mockProductListResponse.data);
  });
});
