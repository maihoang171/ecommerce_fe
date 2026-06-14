// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, vi, it, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CategoryNav } from "./categoryNav";
import { useCategoryListStore } from "../stores/useCategoryStore";
import userEvent from "@testing-library/user-event";

vi.mock("../stores/useCategoryStore", () => ({
  useCategoryListStore: vi.fn(),
}));

describe("categoryNav component", () => {
  const mockSetActiveCategory = vi.fn();
  const mockSetClickedCategoryId = vi.fn();

  const mockCategoryList = [
    {
      id: "1",
      name: "WOMEN",
      slug: "women",
      children: [{ id: "101", name: "Dresses", slug: "dresses" }],
      campaigns: [{ id: "c1", title: "Summer Lookbook", linkUrl: "/summer" }],
    },
    {
      id: "2",
      name: "MEN",
      slug: "men",
      children: [{ id: "201", name: "Shirts", slug: "shirts" }],
      campaigns: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should display menu icon when menu is closed", () => {
    vi.mocked(useCategoryListStore).mockReturnValue({
      categoryList: mockCategoryList,
      clickedCategoryId: null,
      activeCategory: null,
      setClickedCategoryId: mockSetClickedCategoryId,
      setActiveCategory: mockSetActiveCategory,
    });
    render(
      <MemoryRouter>
        <CategoryNav />
      </MemoryRouter>,
    );

    const menuBtn = screen.getByRole("button", { name: /open menu/i });
    expect(menuBtn).toBeInTheDocument();
  });

  it("should display x icon when menu is opened", async () => {
    vi.mocked(useCategoryListStore).mockReturnValue({
      categoryList: mockCategoryList,
      clickedCategoryId: null,
      activeCategory: null,
      setClickedCategoryId: mockSetClickedCategoryId,
      setActiveCategory: mockSetActiveCategory,
    });
    render(
      <MemoryRouter>
        <CategoryNav />
      </MemoryRouter>,
    );
    const user = userEvent.setup();
    const menuBtn = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuBtn);
    const closeBtn = screen.getByRole("button", { name: /close menu/i });
    expect(closeBtn).toBeInTheDocument();
  });

  it("should automatically select first category if none is selected", () => {
    vi.mocked(useCategoryListStore).mockReturnValue({
      categoryList: mockCategoryList,
      clickedCategoryId: null,
      activeCategory: null,
      setActiveCategory: mockSetActiveCategory,
      setClickedCategoryId: mockSetClickedCategoryId,
    });

    render(
      <MemoryRouter>
        <CategoryNav />
      </MemoryRouter>,
    );

    expect(mockSetActiveCategory).toHaveBeenCalledWith(mockCategoryList[0]);
    expect(mockSetClickedCategoryId).toHaveBeenCalledWith(
      mockCategoryList[0].id,
    );
  });

  describe("mobile only", () => {
    it("should change active category on click", async () => {
      vi.mocked(useCategoryListStore).mockReturnValue({
        categoryList: mockCategoryList,
        clickedCategoryId: null,
        activeCategory: null,
        setActiveCategory: mockSetActiveCategory,
        setClickedCategoryId: mockSetClickedCategoryId,
      });

      render(
        <MemoryRouter>
          <CategoryNav />
        </MemoryRouter>,
      );

      const user = userEvent.setup();
      const menuBtn = screen.getByRole("button", { name: /open menu/i });
      await user.click(menuBtn);
      const womenButtons = screen.getAllByText("WOMEN");
      await user.click(womenButtons[0]);

      expect(mockSetActiveCategory).toHaveBeenCalledWith(mockCategoryList[0]);
    });

    it("should render campaigns and children links for the active category", () => {
      vi.mocked(useCategoryListStore).mockReturnValue({
        categoryList: mockCategoryList,
        clickedCategoryId: "1",
        activeCategory: mockCategoryList[0],
        setActiveCategory: mockSetActiveCategory,
        setClickedCategoryId: mockSetClickedCategoryId,
      });

      render(
        <MemoryRouter>
          <CategoryNav />
        </MemoryRouter>,
      );

      const campaignLink = screen.getByRole("link", {
        name: "Summer Lookbook",
      });
      expect(campaignLink).toBeInTheDocument();
      expect(campaignLink).toHaveAttribute("href", "/summer");

      const childrenLinks = screen.getAllByRole("link", { name: "Dresses" });
      expect(childrenLinks.length).toBeGreaterThan(0);
    });
  });

  describe("desktop only", () => {
    it("should change active category on click", async () => {
      vi.mocked(useCategoryListStore).mockReturnValue({
        categoryList: mockCategoryList,
        clickedCategoryId: null,
        activeCategory: null,
        setActiveCategory: mockSetActiveCategory,
        setClickedCategoryId: mockSetClickedCategoryId,
      });

      render(
        <MemoryRouter>
          <CategoryNav />
        </MemoryRouter>,
      );

      const user = userEvent.setup();
      const menButtons = screen.getAllByText("MEN");

      await user.click(menButtons[1]);

      expect(mockSetActiveCategory).toHaveBeenCalledWith(mockCategoryList[1]);
      expect(mockSetClickedCategoryId).toHaveBeenCalledWith(
        mockCategoryList[1].id,
      );
    });
  });
});
