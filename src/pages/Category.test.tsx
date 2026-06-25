// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Category } from "./Category";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { mockCategoryList } from "@/tests/mock/mockData";

const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  };
});

vi.mock("../stores/useCategoryStore", () => ({
  useCategoryStore: vi.fn(),
}));

vi.mock("../components/Body/CampaignHeroBanner", () => ({
  CampaignHeroBanner: () => (
    <div data-testid="mock-campaign-hero-banner">
      Fake CampaignHeroBanner component
    </div>
  ),
}));

vi.mock("../components/Body/ParentCategoryDetail", () => ({
  ParentCategoryDetail: () => (
    <div data-testid="mock-parent-category-detail">
      Fake ParentCategoryDetail
    </div>
  ),
}));
describe("category component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCategoryStore).mockReturnValue({
      categoryList: mockCategoryList,
    });
  });

  afterEach(() => {
    cleanup();
  });
  it("should navigate to NotFound page when missing or incorrect slug", () => {
    vi.mocked(mockUseParams).mockReturnValue({
      parentSlug: "incorrectSlug",
    });

    render(<Category />);

    expect(mockNavigate).toHaveBeenCalledWith("/not-found", {
      replace: true,
    });
  });

  it("should render CampaignHeroBanner and ParentCategoryDetail on success", () => {
    vi.mocked(mockUseParams).mockReturnValue({
      parentSlug: "women",
    });

    render(<Category />);

    expect(screen.getAllByTestId("mock-campaign-hero-banner")).toHaveLength(2);

    expect(
      screen.getByTestId("mock-parent-category-detail"),
    ).toBeInTheDocument();
  });
});
