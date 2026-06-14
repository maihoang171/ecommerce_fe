// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, vi, it, expect } from "vitest";
import { useCategoryListStore } from "../stores/useCategoryStore";
import { cleanup, render, screen } from "@testing-library/react";
import { Body } from "./body";
import { MemoryRouter } from "react-router-dom";

vi.mock("../stores/useCategoryStore", () => ({
  useCategoryListStore: vi.fn(),
}));

describe("body component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render campaigns correctly when active category has data", () => {
    vi.mocked(useCategoryListStore).mockReturnValue({
      activeCategory: {
        id: "cat-1",
        name: "Women",
        slug: "women",
        children: {},
        campaigns: [
          {
            id: "1",
            title: "Campaign 1",
            subTitle: "Subtitle campaign 1",
            imageUrl: "imageUrl",
            linkUrl: "linkUrl",
          },
        ],
      },
    });

    render(
      <MemoryRouter>
        <Body />
      </MemoryRouter>,
    );

    const campaignLink = screen.getByRole("link", { name: /campaign 1/i });

    expect(campaignLink).toBeInTheDocument();

    expect(campaignLink).toHaveAttribute("href", "/linkUrl");
    expect(screen.getByText("Subtitle campaign 1")).toBeInTheDocument();
  });

  it("should fallback empty array and render nothing when active category is null", () => {
    vi.mocked(useCategoryListStore).mockReturnValue({
      activeCategory: null,
    });

    const { container } = render(
      <MemoryRouter>
        <Body />
      </MemoryRouter>,
    );

    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass("w-full flex flex-col pt-14 md:pt-16");

    const links = screen.queryAllByRole("link");
    expect(links).toHaveLength(0);
  });
});
