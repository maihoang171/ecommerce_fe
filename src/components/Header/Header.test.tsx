// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi, expect } from "vitest";
import { Header } from "./Header";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAuthModalStore } from "@/stores/useAuthModelStore";

const renderHeader = () => {
  const renderResult = render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );

  return {
    ...renderResult,
    get navContainer() {
      return screen.getByRole("navigation", {
        name: /main navigation/i,
      });
    },
  };
};

describe("When user is a guest (logged out)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAuthStore.setState({
      user: null,
      isLoggedIn: false,
    });

    useAuthModalStore.setState({
      authMode: null,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("should render standard navigation categories, utils, and a generic login trigger", () => {
    const { navContainer } = renderHeader();

    expect(
      within(navContainer).getByRole("button", { name: /login/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("img", { name: /xuxi e-commerce shop home/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /search products/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view shopping cart/i }),
    ).toBeInTheDocument();

    expect(screen.queryByText("Hi,")).not.toBeInTheDocument();
  });

  it("should toggle the login modal when user clicks the user icon", async () => {
    const { navContainer } = renderHeader();

    const loginButton = within(navContainer).getByRole("button", {
      name: /login/i,
    });

    const user = userEvent.setup();
    await user.click(loginButton);

    expect(screen.getByText("Welcome back!")).toBeInTheDocument();
    expect(useAuthModalStore.getState().authMode).toBe("login");
  });
});

describe("When user is logged in", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAuthStore.setState({
      user: {
        id: "1",
        username: "user123",
        isAdmin: false,
      },
      isLoggedIn: true,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("should render navigation categories, utils, and a user avatar instead of login button ", () => {
    const { navContainer } = renderHeader();

    expect(
      within(navContainer).queryByRole("button", { name: /login/i }),
    ).not.toBeInTheDocument();

    expect(screen.getByText("Hi, user123")).toBeInTheDocument();

    expect(screen.getByText("U")).toBeInTheDocument();
  });
});

describe("Header Modal Interactivity Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, isLoggedIn: false });
    useAuthModalStore.setState({ authMode: null });
  });

  afterEach(() => {
    cleanup();
  });

  it("should successfully close Login modal and open Register modal when clicking redirect link", async () => {
    renderHeader();
    const user = userEvent.setup();

    useAuthModalStore.setState({ authMode: "login" });
    expect(screen.getByText("Welcome back!")).toBeInTheDocument();

    const loginModal = screen.getByTestId("login-modal");
    const switchToRegisterBtn = within(loginModal).getByRole("button", {
      name: /here/i,
    });

    await user.click(switchToRegisterBtn);

    expect(screen.queryByText("Welcome back! ")).not.toBeInTheDocument();
    expect(screen.getByText("Create your new account")).toBeInTheDocument();

    expect(useAuthModalStore.getState().authMode).toBe("register");
  });
});
