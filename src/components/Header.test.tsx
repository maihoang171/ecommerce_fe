// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi, expect } from "vitest";
import { Header } from "./Header";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useAuthModalStore } from "@/features/auth/stores/useAuthModalStore";
import { mockCartItems, mockUserData } from "@/tests/mockData";
import { useLogout } from "@/features/auth/hooks/useAuth";
import {
  useCartStore,
  type ICartItem,
} from "@/features/cart/stores/useCartStore";

vi.mock("../features/category/components/CategoryNav", () => ({
  CategoryNav: () => <div data-testid="category-nav">Mock Category Nav</div>,
}));

vi.mock("../features/auth/components/LoginModal", () => ({
  LoginModal: () => <div data-testid="login-modal">Mock Login Modal</div>,
}));

vi.mock("../features/auth/components/RegisterModal", () => ({
  RegisterModal: () => (
    <div data-testid="register-modal">Mock Register Modal</div>
  ),
}));

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useLogout: vi.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const mockHandleLogout = vi.fn(() => {
    useAuthStore.getState().clearAuth();
  });
  const setupMocks = ({
    user = null,
    authMode = null,
    cart = [],
  }: {
    user?: typeof mockUserData | null;
    authMode?: "login" | "register" | null;
    cart?: ICartItem[];
  } = {}) => {
    useAuthModalStore.setState({ authMode });

    if (user) {
      useAuthStore.getState().setAuth(user, "token");
    } else {
      useAuthStore.getState().clearAuth();
    }

    useCartStore.setState({ cart: cart as ICartItem[] });

    vi.mocked(useLogout).mockReturnValue({
      mutate: mockHandleLogout,
      isPending: false,
    } as unknown as ReturnType<typeof useLogout>);
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
      setupMocks({
        cart: mockCartItems,
      });

      const { navContainer } = renderComponent();

      expect(
        within(navContainer).getByTestId("category-nav"),
      ).toBeInTheDocument();

      expect(within(navContainer).getByRole("button", { name: /login/i }));
    });

    it("should toggle login modal when user click login icon", async () => {
      setupMocks({ authMode: null });

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
      setupMocks({ user: mockUserData });

      const { navContainer } = renderComponent();

      expect(
        within(navContainer).getByText(`Hi, ${mockUserData.username}`),
      ).toBeInTheDocument();

      expect(useAuthStore.getState().user).toEqual(mockUserData);
      expect(useAuthStore.getState().accessToken).toEqual("token");
    });

    it("should log out when clicked", async () => {
      setupMocks({ user: mockUserData });

      const { navContainer } = renderComponent();

      const logoutBtn = within(navContainer).getByRole("button", {
        name: /logout/i,
      });

      const user = userEvent.setup();

      await user.click(logoutBtn);

      expect(useAuthModalStore.getState().authMode).toBe(null);
    });
  });
});
