//@vitest-environment jsdom
import { beforeEach, describe, vi, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  getCategoryListService,
} from "@/services/category";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useGetCategoryList } from "./useCategory";
import { extractErrorMsg } from "@/utils/error";
import { mockCategoryListResponse } from "@/tests/mock/mockResponse";

vi.mock("@/services/category", () => ({
  getCategoryListService: vi.fn(),
}));

vi.mock("@/stores/useCategoryStore", () => ({
  useCategoryStore: vi.fn(),
}));

vi.mock("@/stores/useProductStore", () => ({
  useProductStore: vi.fn(),
}));

vi.mock("@/utils/error", () => ({
  extractErrorMsg: vi.fn(),
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

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

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

    vi.mocked(getCategoryListService).mockResolvedValue(mockCategoryListResponse);

    const { result } = renderHook(() => useGetCategoryList());

    await act(async () => {
      await result.current.handleGetCategoryList();
    });

    expect(mockSetCategoryList).toHaveBeenCalledWith(mockCategoryListResponse.data);
  });

  it("should log an error when an error occurred", async () => {
    const errMsg = "Something went wrong";
    const mockErr = new Error(errMsg);

    vi.mocked(getCategoryListService).mockRejectedValue(mockErr);

    vi.mocked(extractErrorMsg).mockReturnValue(errMsg);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
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

