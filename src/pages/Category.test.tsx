// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Category } from "./Category";
import { mockCategoryList } from "@/tests/mockData";
import { useParams } from "react-router-dom";
import { useGetCategoryList } from "../features/category/hooks/useCategory";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: vi.fn(),
  };
});

vi.mock("@/features/category/hooks/useCategory", () => ({
  useGetCategoryList: vi.fn(),
}));

vi.mock("@/pages/ServerError", () => ({
  ServerError: ({ message }: { message: string }) => (
    <div data-testid="server-error" data-message={message}>
      {message}
    </div>
  ),
}));

vi.mock("@/features/campaign/components/CampaignHeroBanner", () => ({
  CampaignHeroBanner: () => (
    <div data-testid="mock-campaign-hero-banner">
      Fake CampaignHeroBanner component
    </div>
  ),
}));

vi.mock("@/features/category/components/ParentCategoryDetail", () => ({
  ParentCategoryDetail: () => (
    <div data-testid="mock-parent-category-detail">
      Mock ParentCategoryDetail
    </div>
  ),
}));

describe("category component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const mockUseGetCategoryListRes = {
    data: mockCategoryList,
    isPending: false,
    isError: false,
    error: "",
  } as unknown as ReturnType<typeof useGetCategoryList>;

  it("should navigate to NotFound page when component is not loading and current category is not found", () => {
    vi.mocked(useParams).mockReturnValue({
      parentSlug: "men",
    });

    vi.mocked(useGetCategoryList).mockReturnValue({
      ...mockUseGetCategoryListRes,
      data: undefined,
    } as ReturnType<typeof useGetCategoryList>);

    render(<Category />);

    expect(mockNavigate).toHaveBeenCalledWith("/not-found", {
      replace: true,
    });
  });

  it("should render ServerError with exact message on error occurred", () => {
    vi.mocked(useParams).mockReturnValue({
      parentSlug: "women",
    });

    vi.mocked(useGetCategoryList).mockReturnValue({
      ...mockUseGetCategoryListRes,
      isError: true,
      error: new Error("Failed to load category"),
    } as ReturnType<typeof useGetCategoryList>);

    render(<Category />);

    const errComponent = screen.getByTestId("server-error");
    expect(errComponent).toBeInTheDocument();
    expect(errComponent).toHaveTextContent("Failed to load category");
  });

  it("should render CampaignHeroBanner and ParentCategoryDetail on success", () => {
    vi.mocked(useParams).mockReturnValue({
      parentSlug: "women",
    });

    vi.mocked(useGetCategoryList).mockReturnValue({
      ...mockUseGetCategoryListRes,
      isError: false,
    } as ReturnType<typeof useGetCategoryList>);

    render(<Category />);

    expect(screen.getAllByTestId("mock-campaign-hero-banner")).toHaveLength(2);

    expect(
      screen.getByTestId("mock-parent-category-detail"),
    ).toBeInTheDocument();
  });
});
