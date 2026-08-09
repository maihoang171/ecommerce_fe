// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi, expect } from "vitest";
import { Header } from "./Header";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useAuthModalStore } from "@/features/auth/stores/useAuthModalStore";
import { useLogout } from "@/features/auth/hooks/useAuth";
import {
  useCartStore,
  type ILocalCartItem,
} from "@/features/cart/stores/useCartStore";
import { useGetCart } from "@/features/cart/hooks/useCart";
import type { IDbCart } from "@/features/cart/services/cart";
import { mockDbCart, mockLocalCartItems } from "@/tests/mockCartData";
import { mockUser } from "@/tests/mockUserData";
import type { SearchDrawerProps } from "@/components/SearchDrawer";

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

vi.mock("@/features/cart/hooks/useCart", () => ({
  useGetCart: vi.fn(),
}));

vi.mock("@/components/SearchDrawer", () => ({
  SearchDrawer: ({ isOpen, onClose }: SearchDrawerProps) => (
    <div data-testid="search-drawer">
      {isOpen && (
        <button data-testid="close-btn" onClick={onClose}>
          Close
        </button>
      )}
    </div>
  ),
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
    user?: typeof mockUser | null;
    authMode?: "login" | "register" | null;
    cart?: ILocalCartItem[] | IDbCart;
  } = {}) => {
    useAuthModalStore.setState({ authMode });

    if (user) {
      useAuthStore.getState().setAuth(user, "token");
    } else {
      useAuthStore.getState().clearAuth();
    }

    vi.mocked(useGetCart).mockReturnValue({
      data: user ? mockDbCart : null,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useGetCart>);

    useCartStore.setState({ cart: cart as ILocalCartItem[] });

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

  it("should display SearchDrawer component when clicked", async () => {
    setupMocks();
    renderComponent();

    const user = userEvent.setup();

    const searchBtn = screen.getByRole("button", {
      name: /search products/i,
    });

    await user.click(searchBtn);

    const searchDrawer = screen.getByTestId("search-drawer");
    expect(searchDrawer).toBeInTheDocument();
  });

  it("closes the search drawer when onClose is called", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const searchBtn = screen.getByRole("button", { name: /search products/i });
    await user.click(searchBtn);

    expect(screen.getByTestId("close-btn")).toBeInTheDocument();

    await user.click(screen.getByTestId("close-btn"));

    expect(screen.queryByTestId("close-btn")).not.toBeInTheDocument();
  });
  describe("when user is a guest (log out)", () => {
    it("should render standard navigation categories, and a generic login trigger", () => {
      setupMocks({
        cart: mockLocalCartItems,
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
      setupMocks({ user: mockUser });

      const { navContainer } = renderComponent();

      expect(
        within(navContainer).getByText(`Hi, ${mockUser.username}`),
      ).toBeInTheDocument();

      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().accessToken).toEqual("token");
    });

    it("should display total quantity 0 when cart items is empty", () => {
      setupMocks();
    });

    it("should log out when clicked", async () => {
      setupMocks({ user: mockUser });

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
