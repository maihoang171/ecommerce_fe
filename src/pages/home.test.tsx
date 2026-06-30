// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { Home } from "./Home";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useCampaignStore } from "@/stores/useCampaignStore";
import { useGetCampaignList } from "@/hooks/useCampaign";
import { mockCategoryList } from "@/tests/mock/mockData";

vi.mock("@/components/Body/CampaignHeroBanner", () => ({
  CampaignHeroBanner: () => (
    <div data-testid="campaignHeroBanner">
      Mock CampaignHeroBanner component
    </div>
  ),
}));

vi.mock("@/hooks/useCampaign", () => ({
  useGetCampaignList: vi.fn(),
}));

vi.mock("@/stores/useCampaignStore", () => ({
  useCampaignStore: vi.fn(),
}));

vi.mocked(useGetCampaignList).mockReturnValue({
  handleGetCampaignList: vi.fn(),
  isLoading: false
});

describe("Home component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render message category list is empty", () => {
    vi.mocked(useCampaignStore).mockReturnValue({
      campaignList: [],
    });

    render(<Home />);

    expect(screen.getByText("Welcome to XuXi Clothes")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We are currently updating our catalog. Check back soon!",
      ),
    ).toBeInTheDocument();
  });

  it("should render campaign list when category list is not empty", () => {
    vi.mocked(useCampaignStore).mockReturnValue({
      campaignList: mockCategoryList[0].campaigns,
    });

    render(<Home />);

    expect(screen.getAllByTestId("campaignHeroBanner")).toHaveLength(2);
  });
});
