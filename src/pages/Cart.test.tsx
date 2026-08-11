//@vitest-environment jsdom
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import "@testing-library/jest-dom/vitest";
import {  fireEvent, render, screen } from "@testing-library/react";
import {  beforeEach, describe, expect, it, vi } from "vitest";
import { Cart } from "./Cart";
import {
  useCartStore,
  type ILocalCartItem,
} from "@/features/cart/stores/useCartStore";
import { mockLocalCartItems } from "@/tests/mockCartData";
import { useDeleteCartItem, useGetCart } from "@/features/cart/hooks/useCart";
import { MemoryRouter } from "react-router-dom";
import type { IUser } from "@/features/auth/services/auth";
import type { IDbCart } from "@/features/cart/services/cart";
import { mockUser } from "@/tests/mockUserData";

vi.mock("@/features/auth/stores/useAuthStore", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("@/features/cart/stores/useCartStore", () => ({
  useCartStore: vi.fn(),
}));

vi.mock("@/features/cart/hooks/useCart", () => ({
  useGetCart: vi.fn(),
  useDeleteCartItem: vi.fn(),
}));

vi.mock("@/components/Loading", () => ({
  Loading: () => <div data-testid="mock-loading">mock loading component</div>,
}));

vi.mock("./ServerError", () => ({
    ServerError: () => <div data-testid="mock-server-error">mock server error</div>
}))

interface SetupMockProps {
  user?: IUser | null;
  cart?: ILocalCartItem[];
  dataGetCart?: IDbCart;
  isPendingGetCart?: boolean;
  isErrorGetCart?: boolean;
  errorGetCart?: Error | null;
  mutateDeleteCartItem?: ReturnType<typeof vi.fn>;
  isPendingDeleteCartItem?: boolean;
}

const mockHandleDeleteCartItem = vi.fn();
const setupMocks = ({
  user = null,
  cart = [],
  dataGetCart = undefined,
  isPendingGetCart = false,
  isErrorGetCart = false,
  errorGetCart = null,
  mutateDeleteCartItem = mockHandleDeleteCartItem,
  isPendingDeleteCartItem = false,
}: SetupMockProps = {}) => {
  vi.mocked(useAuthStore).mockReturnValue({ user });
  vi.mocked(useCartStore).mockReturnValue({ cart });

  vi.mocked(useGetCart).mockReturnValue({
    data: dataGetCart,
    isPending: isPendingGetCart,
    isError: isErrorGetCart,
    error: errorGetCart,
  } as ReturnType<typeof useGetCart>);

  vi.mocked(useDeleteCartItem).mockReturnValue({
    mutate: mutateDeleteCartItem,
    isPending: isPendingDeleteCartItem,
  } as unknown as ReturnType<typeof useDeleteCartItem>);
};

describe("Cart component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>,
    );
  };

  it("should display delete cartItem when clicked", () => {
    setupMocks({ cart: mockLocalCartItems });
    renderComponent();

    const deleteBtn = screen.getAllByTestId("delete-cart-item-button");
    fireEvent.click(deleteBtn[0]);

    expect(mockHandleDeleteCartItem).toHaveBeenCalled();
  });

  it("should return loading component when logged in and fetching data", () => {
    setupMocks({ user: mockUser, isPendingGetCart: true });
    renderComponent();

    expect(screen.getByTestId("mock-loading")).toBeInTheDocument();
  });

  it("should return server error component when an error occur", () => {
    setupMocks({
      user: mockUser,
      isErrorGetCart: true,
      errorGetCart: new Error("Something went wrong!"),
    });

    renderComponent()

    expect(screen.getByTestId("mock-server-error")).toBeInTheDocument();
  });
});
