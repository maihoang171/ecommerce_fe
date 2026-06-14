// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { Home } from "./home";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { useCategoryListStore } from "../stores/useCategoryStore";

vi.mock("../components/header.tsx", () => ({
  Header: () => <div data-testid="header">Mock header</div>,
}));

vi.mock("../components/body.tsx", () => ({
  Body: () => <div data-testid="body">Mock body</div>,
}));

vi.mock("../stores/useCategoryStore", () => ({
  useCategoryListStore: vi.fn(),
}));

describe("home component", () => {
  const mockSetActiveCategory = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  it("should render loading pulse when category list is empty", () => {
    vi.mocked(useCategoryListStore).mockReturnValue({
      categoryList: [],
      clickedCategoryId: null,
      setActiveCategory: mockSetActiveCategory,
    });
    const { container } = render(<Home />);

    const pulseDiv = container.querySelector(".animate-pulse");
    expect(pulseDiv).toBeInTheDocument();
    expect(screen.queryByTestId("header")).toBeInTheDocument();
    expect(screen.queryByTestId("body")).not.toBeInTheDocument();
  });

  it("should render header and body when category list is not empty", () => {
    vi.mocked(useCategoryListStore).mockReturnValue({
      categoryList: [
        {
          id: "1",
          name: "Category 1",
          children: [],
          campaigns: [],
        },
      ],
      clickedCategoryId: "1",
      setActiveCategory: mockSetActiveCategory,
    });
    render(<Home />);

    expect(screen.queryByTestId("header")).toBeInTheDocument();
    expect(screen.queryByTestId("body")).toBeInTheDocument();
  });
});
