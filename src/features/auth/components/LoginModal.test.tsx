// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoginModal } from "./LoginModal";
import { useAuthModalStore, type AuthMode } from "@/features/auth/stores/useAuthModalStore";

vi.mock("./LoginForm", () => ({
  LoginForm: () => <div data-testid="login-form">Mock Login Form</div>,
}));


describe("LoginModal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const mockClose = vi.fn()
  
  const setupMocks = ({authMode = null}: {authMode?: AuthMode}) => {
    useAuthModalStore.setState({
      authMode,
      close: mockClose
    })
  }

  it("should render the login modal when authMode is login", () => {
    setupMocks({authMode : "login"})

    render(<LoginModal />);

    expect(screen.getByTestId("login-modal")).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("should not render the login modal when authMode is not login", () => {
    setupMocks({})
    render(<LoginModal />);

    expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
  });

  it("should call close function when close button or backdrop is clicked", async () => {
    setupMocks({authMode: "login"})

    render(<LoginModal />);

    const closeButton = screen.getByRole("button");
    await userEvent.click(closeButton);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});