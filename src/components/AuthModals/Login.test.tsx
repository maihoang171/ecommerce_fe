// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, vi, it, expect } from "vitest";
import { useLogin } from "@/hooks/useAuth";
import { screen, render, cleanup, waitFor } from "@testing-library/react";
import { Login } from "./Login";
import userEvent from "@testing-library/user-event";
import {
  runPasswordTests,
  runUsernameTests,
} from "@/utils/__test__/authModalsTest";

vi.mock("@/hooks/useAuth", () => ({
  useLogin: vi.fn(),
}));

const mockOpenRegister = vi.fn();
const mockClose = vi.fn();

vi.mock("@/stores/useAuthModelStore", () => ({
  useAuthModalStore: () => ({
    openRegister: mockOpenRegister,
    close: mockClose,
  }),
}));

describe("Login component validation and submission", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useLogin as ReturnType<typeof vi.fn>).mockReturnValue({
      handleLogin: mockLogin,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("should render all elements property", () => {
    render(<Login />);

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "here" }));
  });

  runUsernameTests(() => render(<Login />));

  runPasswordTests(() => render(<Login />));

  it("should switch to register modal on click", async () => {
    render(<Login />);

    expect(screen.getByRole("button", { name: "here" })).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "here" }));

    expect(mockOpenRegister).toHaveBeenCalled();
  });

  it("should keep the modal open on errors", async () => {
    const mockHandleLoginErr = vi
      .fn()
      .mockRejectedValue(new Error("Incorrect Password"));

    (useLogin as ReturnType<typeof vi.fn>).mockReturnValue({
      handleLogin: mockHandleLoginErr,
    });

    render(<Login />);

    const user = userEvent.setup();
    const validUserInput = screen.getByPlaceholderText(/^username$/i);
    const inValidPasswordInput = screen.getByPlaceholderText(/^password$/i);

    await user.type(validUserInput, "user123");
    await user.type(inValidPasswordInput, "User1234@");

    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockHandleLoginErr).toHaveBeenCalled();
      expect(mockClose).not.toHaveBeenCalled();
    });
  });

  it("should submit the form on successful validation", async () => {
    render(<Login />);

    const user = userEvent.setup();
    const validUserInput = screen.getByPlaceholderText(/^username$/i);
    const validPasswordInput = screen.getByPlaceholderText(/^password$/i);

    await user.type(validUserInput, "user123");
    await user.type(validPasswordInput, "User1234@");

    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockClose).toHaveBeenCalled();
    });
  });
});
