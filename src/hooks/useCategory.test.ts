//@vitest-environment jsdom
import { beforeEach, describe, vi, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  getCategoryListService,
  getProductListByCategorySlugService,
} from "@/services/category";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useGetCategoryList, useGetProductList } from "./useCategory";
import { extractErrorMsg } from "@/utils/error";
import { useProductListStore } from "@/stores/useProductStore";
import { toast } from "sonner";

vi.mock("@/services/category", () => ({
  getCategoryListService: vi.fn(),
  getProductListByCategorySlugService: vi.fn(),
}));

vi.mock("@/stores/useCategoryStore", () => ({
  useCategoryStore: vi.fn(),
}));

vi.mock("@/stores/useProductStore", () => ({
  useProductListStore: vi.fn(),
}));

vi.mock("@/utils/error", () => ({
  extractErrorMsg: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("useGetCategoryList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSetCategoryList = vi.fn();

  vi.mocked(useCategoryStore).mockReturnValue({
    setCategoryList: mockSetCategoryList,
  });

  it("should throw an error when the category list is not found", async () => {
    const mockRes = {
      success: false,
      data: null,
    };

    vi.mocked(getCategoryListService).mockResolvedValue(mockRes);

    vi.mocked(extractErrorMsg).mockReturnValue("No category found");

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { result } = renderHook(() => useGetCategoryList());

    await act(async () => {
      await result.current.handleGetCategoryList();
    });

    expect(mockSetCategoryList).not.toHaveBeenCalled();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Get category list failed: No category found",
    );
    consoleSpy.mockRestore();
  });

  it("should receive data from API and save it to the category list store", async () => {
    const mockRes = {
      success: true,
      data: [
        {
          id: 1,
          name: "category",
          slug: "slug",
          imageUrl: "/imageUrl",
          children: [],
          parentId: null,
          campaigns: [],
        },
      ],
    };

    vi.mocked(getCategoryListService).mockResolvedValue(mockRes);

    const { result } = renderHook(() => useGetCategoryList());

    await act(async () => {
      await result.current.handleGetCategoryList();
    });

    expect(mockSetCategoryList).toHaveBeenCalledWith(mockRes.data);
  });

  it("should log an error when an error occurred", async () => {
    const errMsg = "Something went wrong";
    const mockErr = new Error(errMsg);

    vi.mocked(getCategoryListService).mockRejectedValue(mockErr);

    vi.mocked(extractErrorMsg).mockReturnValue(errMsg);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const { result } = renderHook(() => useGetCategoryList());

    await act(async () => {
      await result.current.handleGetCategoryList();
    });

    expect(mockSetCategoryList).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Get category list failed: Something went wrong",
    );
  });
});

describe("useGetProductList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const mockParentSlug = "parentSlug";
  const mockChildSlug = "childSlug";

  const mockSetProductList = vi.fn();

  vi.mocked(useProductListStore).mockReturnValue({
    setProductList: mockSetProductList,
  });

  it("should throw an error and toast message when the product list is not found", async () => {
    const mockRes = {
      success: false,
      data: null,
    };

    vi.mocked(getProductListByCategorySlugService).mockResolvedValue(mockRes);
    vi.mocked(extractErrorMsg).mockReturnValue("Product list not found");

    const { result } = renderHook(() => useGetProductList());
    await act(async () => {
      await result.current.handleGetProductList(mockParentSlug, mockChildSlug);
    });

    expect(mockSetProductList).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      "Failed to fetch product list: Product list not found",
      {
        position: "bottom-right",
      },
    );
  });

  it("should receive data from API and save to product list store", async () => {
    const mockRes = {
      success: true,
      data: [
        {
          id: "1",
          name: "product",
          price: 123000,
          description: "description",
          categoryId: 1,
          images: [],
          variants: [],
        },
      ],
    };

    vi.mocked(getProductListByCategorySlugService).mockResolvedValue(mockRes);

    const { result } = renderHook(() => useGetProductList());
    await act(async () => {
      await result.current.handleGetProductList(mockParentSlug, mockChildSlug);
    });

    expect(mockSetProductList).toHaveBeenCalledWith(mockRes.data);
  });
});
