// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RegisterModal } from "./RegisterModal";
import { useAuthModalStore, type AuthMode } from "@/features/auth/stores/useAuthModalStore";

vi.mock("./RegisterForm.tsx", () => ({
  RegisterForm: () => <div data-testid="register-form">Mock Register Form</div>,
}));



describe("Register Modal", () => {
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

  it("should render the register form when authMode is register", async () => {
    setupMocks({authMode: "register"})

    render(<RegisterModal />);

    expect(await screen.findByTestId("register-form")).toBeInTheDocument();
  });

  it("should not render the register form when authMode is not register", () => {
    setupMocks({})
    render(<RegisterModal />);

    expect(screen.queryByTestId("register-form")).not.toBeInTheDocument();
  });

  it("should call close function when backdrop is clicked", async () => {
   setupMocks({authMode: "register"})

    render(<RegisterModal />);

    const backdrop = screen.getByTestId("back-drop");
    await userEvent.click(backdrop);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});