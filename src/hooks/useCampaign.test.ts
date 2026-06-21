//@vitest-environment jsdom
import { getCampaignListService } from "@/services/campaign";
import { useCampaignStore } from "@/stores/useCampaignStore";
import { beforeEach, describe, vi, it, expect } from "vitest";
import { useGetCampaignList } from "./useCampaign";
import { renderHook, act } from "@testing-library/react";
import { extractErrorMsg } from "@/utils/error";
import { toast } from "sonner";

vi.mock("@/hooks/userCampaignStore", () => ({
  setCampaignList: vi.fn(),
}));

vi.mock("@/services/campaign", () => ({
  getCampaignListService: vi.fn(),
}));

vi.mock("@/stores/useCampaignStore", () => ({
  useCampaignStore: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/utils/error", () => ({
  extractErrorMsg: vi.fn(),
}));

describe("useGetCampaignList", () => {
  const mockSetCampaignList = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCampaignStore).mockReturnValue({
      setCampaignList: mockSetCampaignList,
    });
  });

  it("should get campaign list from API and set into campaign store", async () => {
    const mockRes = {
      success: true,
      data: [
        {
          id: "1",
          title: "title",
          subTitle: "subTitle",
          imageUrl: "imageUrl",
          linkUrl: "linkUrl",
        },
      ],
    };

    vi.mocked(getCampaignListService).mockResolvedValue(mockRes);

    const { result } = renderHook(() => useGetCampaignList());
    await act(async () => {
      await result.current.handleGetCampaignList();
    });

    expect(mockSetCampaignList).toHaveBeenCalledWith(mockRes.data);
  });

  it("should fallback to an empty array when API return no data", async () => {
    const mockRes = {
      success: true,
      data: null,
    };

    vi.mocked(getCampaignListService).mockResolvedValue(mockRes);

    const { result } = renderHook(() => useGetCampaignList());
    await act(async () => {
      await result.current.handleGetCampaignList();
    });

    expect(mockSetCampaignList).toHaveBeenCalledWith([]);
  });

  it("should toast message on error occurred", async () => {
    const errMsg = "Something went wrong";

    const mockErr = new Error(errMsg);

    vi.mocked(getCampaignListService).mockRejectedValue(mockErr);

    vi.mocked(extractErrorMsg).mockReturnValue(errMsg);

    const { result } = renderHook(() => useGetCampaignList());

    await act(async () => {
      await result.current.handleGetCampaignList();
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Failed to fetch campaign list: " + errMsg,
      {
        position: "bottom-right",
      },
    );
  });
});
