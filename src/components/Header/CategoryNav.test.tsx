// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, vi, it, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CategoryNav } from "../Header/CategoryNav";
import { useCategoryStore } from "@/stores/useCategoryStore";
import userEvent from "@testing-library/user-event";
import { useGetCategoryList } from "@/hooks/useCategory";

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
  const mockSetActiveCategory = vi.fn();
  const mockHandleGetCategoryList = vi.fn();

  const mockCategoryList = [
    {
      id: "1",
      name: "WOMEN",
      slug: "women",
      children: [{ id: "101", name: "Dresses", slug: "dresses" }],
      campaigns: [{ id: "1", title: "Summer Look book", linkUrl: "/summer" }],
    },
    {
      id: "2",
      name: "MEN",
      slug: "men",
      children: [{ id: "201", name: "Shirts", slug: "shirts" }],
      campaigns: [],
    },
  ];

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
      handleGetCategoryList: mockHandleGetCategoryList,
    });

    vi.mocked(useCategoryStore).mockReturnValue({
      categoryList: mockCategoryList,
      activeCategory: mockCategoryList[0],
      setActiveCategory: mockSetActiveCategory,
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe("mobile only", () => {
    it("should set active category on click", async () => {
      const { user, getOpenMenuBtn, getWomenBtns, getMenBtns } = setup();

      await user.click(getOpenMenuBtn());

      const mobileWomenBtn = getWomenBtns()[0];
      expect(mobileWomenBtn.className).toContain("text-black");

      const mobileMenBtn = getMenBtns()[0];
      expect(mobileMenBtn.className).toContain("text-gray-500");

      await user.click(mobileMenBtn);

      expect(mockSetActiveCategory).toHaveBeenCalledWith(mockCategoryList[1]);
    });

    it("should render campaigns and children links for the active category", async () => {
      const { user, getOpenMenuBtn } = setup();

      await user.click(getOpenMenuBtn());

      const campaignLink = screen.getAllByRole("link", {
        name: /Summer Look book/i,
      });

      expect(campaignLink[0]).toBeInTheDocument();
      expect(campaignLink[0]).toHaveAttribute("href", "/summer");

      const childrenLinks = screen.getAllByRole("link", { name: "Dresses" });
      expect(childrenLinks.length).toBeGreaterThan(0);
    });

    it("should close the menu when clicking a campaign or a child link", async () => {
      const { user, getOpenMenuBtn, getCloseMenuBtn } = setup();

      //campaign
      await user.click(getOpenMenuBtn());

      expect(getCloseMenuBtn()).toBeInTheDocument();

      const campaignLink = screen.getAllByRole("link", {
        name: /Summer Look book/i,
      })[0];
      await user.click(campaignLink);

      expect(getOpenMenuBtn()).toBeInTheDocument();

      //child link
      await user.click(getOpenMenuBtn());
      expect(getCloseMenuBtn()).toBeInTheDocument();

      const childLink = screen.getAllByRole("link", { name: /Dresses/i })[0];
      await user.click(childLink);

      expect(getOpenMenuBtn()).toBeInTheDocument();
    });
  });

  describe("desktop only", () => {
    it("should set active category on click", async () => {
      const { user, getMenBtns } = setup();

      await user.click(getMenBtns()[1]);

      expect(mockSetActiveCategory).toHaveBeenCalledWith(mockCategoryList[1]);
      expect(mockNavigate).toHaveBeenCalledWith("/category/men");
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
