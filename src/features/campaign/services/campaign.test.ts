import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosClient } from "@/services/axios";
import { getCampaignListService } from "../services/campaign";

vi.mock("@/services/axios", () => ({
  axiosClient: {
    get: vi.fn(),
  },
}));

describe("campaign service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCampaignListService", () => {
    it("should fetch and return campaign list successfully", async () => {
      const mockCampaigns = [
        {
          id: "1",
          title: "Summer Sale",
          subTitle: "Up to 50% off",
          imageUrl: "img.png",
          linkUrl: "/sale",
        },
      ];

      vi.mocked(axiosClient.get).mockResolvedValueOnce({
        data: {
          success: true,
          data: mockCampaigns,
        },
      });

      const result = await getCampaignListService();

      expect(axiosClient.get).toHaveBeenCalledWith("/campaign");
      expect(result).toEqual(mockCampaigns);
    });

    it("should return an empty array when campaign data is missing", async () => {
      vi.mocked(axiosClient.get).mockResolvedValueOnce({
        data: {
          success: false,
          data: null,
        },
      });

      const result = await getCampaignListService();

      expect(axiosClient.get).toHaveBeenCalledWith("/campaign");
      expect(result).toEqual([]);
    });
  });
});