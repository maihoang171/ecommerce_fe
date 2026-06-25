// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, vi, it, expect } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CategoryNav } from "../Header/CategoryNav";
import { useCategoryStore } from "@/stores/useCategoryStore";
import userEvent from "@testing-library/user-event";
import { useGetCategoryList } from "@/hooks/useCategory";
import { mockCategoryList } from "@/tests/mock/mockData";

vi.mock("@/stores/useCategoryStore", () => ({
  useCategoryStore: vi.fn(),
}));

vi.mock("@/hooks/useCategory", () => ({
  useGetCategoryList: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("categoryNav component", () => {
  const mockSetActiveParentCategory = vi.fn();
  const mockSetActiveChildCategory = vi.fn();

  const setup = () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CategoryNav />
      </MemoryRouter>,
    );

    return {
      user,
      getOpenMenuBtn: () => screen.getByRole("button", { name: /open menu/i }),
      getCloseMenuBtn: () =>
        screen.getByRole("button", { name: /close menu/i }),
      getWomenBtns: () => screen.getAllByText("WOMEN"),
      getMenBtns: () => screen.getAllByText("MEN"),
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useGetCategoryList).mockReturnValue({
      handleGetCategoryList: vi.fn(),
    });

    vi.mocked(useCategoryStore).mockReturnValue({
      categoryList: mockCategoryList,
      activeParentCategory: mockCategoryList[0],
      setActiveParentCategory: mockSetActiveParentCategory,
      setActiveChildCategory: mockSetActiveChildCategory,
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe("mobile only", () => {
    it("should set active parent category on click and navigate to the category page", async () => {
      const { user, getOpenMenuBtn, getWomenBtns, getMenBtns } = setup();

      await user.click(getOpenMenuBtn());

      const womenBtn = getWomenBtns()[0];
      expect(womenBtn.className).toContain("text-black");

      const menBtn = getMenBtns()[0];
      expect(menBtn.className).toContain("text-gray-500");

      await user.click(menBtn);

      expect(mockSetActiveParentCategory).toHaveBeenCalledWith(
        mockCategoryList[1],
      );

      expect(mockNavigate).toHaveBeenCalledWith("/men");
    });

    it("should set active child category on click and navigate to product list page", async () => {
      const { user, getOpenMenuBtn } = setup();

      await user.click(getOpenMenuBtn());

      const childLink = screen.getAllByRole("button", { name: /Dresses/i })[0];

      await user.click(childLink);

      expect(mockNavigate).toHaveBeenCalledWith("/women/dresses");
    });

    it("should render campaigns and children links for the active category", async () => {
      const { user, getOpenMenuBtn } = setup();

      await user.click(getOpenMenuBtn());

      const campaignLink = screen.getAllByRole("link", {
        name: /Summer Lookbook/i,
      });

      expect(campaignLink[0]).toBeInTheDocument();
      expect(campaignLink[0]).toHaveAttribute("href", "/campaigns/summer");

      const childrenLinks = screen.getAllByRole("button", { name: "Dresses" });
      expect(childrenLinks.length).toBeGreaterThan(0);
    });

    it("should close the menu when clicking a campaign or a child link", async () => {
      const { user, getOpenMenuBtn, getCloseMenuBtn } = setup();

      //campaign
      await user.click(getOpenMenuBtn());

      expect(getCloseMenuBtn()).toBeInTheDocument();

      const campaignLink = screen.getAllByRole("link", {
        name: /Summer Lookbook/i,
      })[0];
      await user.click(campaignLink);

      expect(getOpenMenuBtn()).toBeInTheDocument();

      //child link
      await user.click(getOpenMenuBtn());
      expect(getCloseMenuBtn()).toBeInTheDocument();

      const childLink = screen.getAllByRole("button", { name: /Dresses/i })[0];
      await user.click(childLink);

      expect(getOpenMenuBtn()).toBeInTheDocument();
    });
  });

  describe("desktop only", () => {
    it("should set active category on click and navigate to the specific page", async () => {
      const { user, getMenBtns } = setup();

      const menBtn = getMenBtns()[1];
      expect(menBtn.className).toContain("text-gray-400");

      await user.click(menBtn);

      expect(mockSetActiveParentCategory).toHaveBeenCalledWith(
        mockCategoryList[1],
      );
      expect(mockNavigate).toHaveBeenCalledWith("/men");

      //test user click child category link
      await user.hover(menBtn);

      const childLink = screen.getAllByRole("button", { name: /Shirts/i })[1];

      fireEvent.click(childLink);

      expect(mockNavigate).toHaveBeenCalledWith("/men/shirts");
    });

    it("should clear hoverSlug on mouse leave", async () => {
      const { user, getMenBtns } = setup();

      const desktopMenBtn = getMenBtns()[1];
      const tabWrapperDiv = desktopMenBtn.closest("div.group")!;

      await user.hover(tabWrapperDiv);

      expect(screen.getAllByText("Shirts").length).toBeGreaterThan(0);

      await user.unhover(tabWrapperDiv);
      expect(screen.queryAllByText("Shirts").length).toBe(0);
    });
  });
});
