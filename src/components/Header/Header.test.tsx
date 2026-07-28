// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi, expect } from "vitest";
import { Header } from "./Header";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAuthModalStore, type AuthMode } from "@/stores/useAuthModalStore";
import type { IUser } from "@/services/auth";
import { mockUserData } from "@/tests/mock/mockData";

vi.mock("./CategoryNav", () => ({
  CategoryNav: () => <div data-testid="category-nav">Mock Category Nav</div>,
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const setupMocks = ({
    user = null,
    isLoggedIn = false,
    authMode = null,
  }: {
    user?: IUser | null;
    isLoggedIn?: boolean;
    authMode?: AuthMode;
  }) => {
    useAuthStore.setState({
      user,
      isLoggedIn,
    });

    useAuthModalStore.setState({
      authMode,
    });
  };

  const renderComponent = () => {
    const result = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    return {
      ...result,
      get navContainer() {
        return screen.getByRole("navigation", { name: /main navigation/i });
      },
    };
  };

  describe("when user is a guest (log out)", () => {
    it("should render standard navigation categories, and a generic login trigger", () => {
      setupMocks({});

      const { navContainer } = renderComponent();

      expect(
        within(navContainer).getByTestId("category-nav"),
      ).toBeInTheDocument();

      expect(within(navContainer).getByRole("button", { name: /login/i }));
    });

    it("should toggle login modal when user click login icon", async () => {
      setupMocks({});

      const { navContainer } = renderComponent();

      const loginBtn = within(navContainer).getByRole("button", {
        name: /login/i,
      });

      const user = userEvent.setup();

      await user.click(loginBtn);

      expect(useAuthModalStore.getState().authMode).toBe("login");
    });
  });

  describe("when user is logged in", () => {
    it("should display user name when logged in", () => {
      setupMocks({ user: mockUserData, isLoggedIn: true });

      const { navContainer } = renderComponent();

      expect(
        within(navContainer).getByText(`Hi, ${mockUserData.username}`),
      ).toBeInTheDocument();
    });
  });
});
