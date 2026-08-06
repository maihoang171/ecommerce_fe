// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, vi, it, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Home } from "@/pages/Home";
import { useGetCampaignList } from "@/features/campaign/hooks/useCampaign";
import type { ICampaign } from "@/features/campaign/services/campaign";

vi.mock("@/features/campaign/hooks/useCampaign", () => ({
  useGetCampaignList: vi.fn(),
}));

vi.mock("@/components/Loading", () => ({
  Loading: () => <div data-testid="loading-spinner">Loading...</div>,
}));

vi.mock("@/features/campaign/components/CampaignHeroBanner", () => ({
  CampaignHeroBanner: ({ campaign }: { campaign: ICampaign }) => (
    <div data-testid="campaign-banner">{campaign.title}</div>
  ),
}));

vi.mock("@/pages/ServerError", () => ({
  ServerError: ({ message }: { message?: string }) => (
    <div data-testid="server-error">{message || "Server Error"}</div>
  ),
}));

describe("Home component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render loading spinner when isLoading is true", () => {
    vi.mocked(useGetCampaignList).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useGetCampaignList>);

    render(<Home />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should render ServerError with extracted message when an error occurs", () => {
    vi.mocked(useGetCampaignList).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed to fetch campaigns"),
    } as unknown as ReturnType<typeof useGetCampaignList>);

    render(<Home />);

    const serverError = screen.getByTestId("server-error");
    expect(serverError).toBeInTheDocument();
    expect(serverError).toHaveTextContent("Failed to fetch campaigns");
  });

  it("should render campaign banners when campaign list has items", () => {
    const mockCampaigns = [
      { id: "1", title: "Summer Sale" },
      { id: "2", title: "Winter Collection" },
    ];

    vi.mocked(useGetCampaignList).mockReturnValue({
      data: mockCampaigns,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useGetCampaignList>);

    render(<Home />);

    const banners = screen.getAllByTestId("campaign-banner");
    expect(banners).toHaveLength(2);
    expect(screen.getByText("Summer Sale")).toBeInTheDocument();
    expect(screen.getByText("Winter Collection")).toBeInTheDocument();
  });

  it("should render ServerError fallback when campaign list is empty", () => {
    vi.mocked(useGetCampaignList).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useGetCampaignList>);

    render(<Home />);

    expect(screen.getByTestId("server-error")).toBeInTheDocument();
  });
});
