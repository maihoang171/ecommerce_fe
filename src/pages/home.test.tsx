// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { Home } from "./Home";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useCampaignStore } from "@/stores/useCampaignStore";

vi.mock("@/components/Body/CampaignHeroBanner", () => ({
  CampaignHeroBanner: () => (
    <div data-testid="campaignHeroBanner">Mock CampaignHeroBanner</div>
  ),
}));

vi.mock("@/stores/useCampaignStore", () => ({
  useCampaignStore: vi.fn(),
}));

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
      campaignList: [
        {
          id: "1",
          title: "title",
          subTitle: "sub title",
          imageUrl: "/imageUrl",
          linkUrl: "/linkUrl",
        },
      ],
    });

    render(<Home />);

    expect(screen.queryByTestId("campaignHeroBanner")).toBeInTheDocument();
  });
});
