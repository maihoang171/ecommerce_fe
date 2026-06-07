// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { describe, it, vi, beforeEach, expect, afterEach } from "vitest";
import { useRegisterUser } from "../hooks/useAuth";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { Register } from "./register";
import userEvent from "@testing-library/user-event";
import {
  runPasswordTests,
  runUserNameTests,
} from "../utils/__test__/authHelpers";

vi.mock("../hooks/useAuth", () => ({
  useRegisterUser: vi.fn(),
}));

const mockOpenLogin = vi.fn();
const mockClose = vi.fn();
vi.mock("../stores/useAuthModeStore", () => ({
  useAuthModalStore: () => ({
    openLogin: mockOpenLogin,
    close: mockClose,
  }),
}));

describe("register component validation and submission", () => {
  const mockHandleRegisterUser = vi.fn();

  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();

    (useRegisterUser as ReturnType<typeof vi.fn>).mockReturnValue({
      handleRegisterUser: mockHandleRegisterUser,
    });
  });

  it("should render all elements property", () => {
    render(<Register />);
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Register" }),
    ).toBeInTheDocument();
  });

  runUserNameTests(() => render(<Register />));

  runPasswordTests(() => render(<Register />));

  it("should switch to login modal on click", async () => {
    render(<Register />);
    expect(screen.getByRole("button", { name: "here" })).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "here" }));
    expect(mockOpenLogin).toHaveBeenCalled();
  });

  it("should submit the form on successful validation", async () => {
    render(<Register />);
    const user = userEvent.setup();
    const validUserInput = screen.getByPlaceholderText(/^username$/i);
    const validPasswordInput = screen.getByPlaceholderText(/^password$/i);
    const validConfirmPasswordInput =
      screen.getByPlaceholderText(/^confirm password$/i);

    await user.type(validUserInput, "user123");
    await user.type(validPasswordInput, "User1234@");
    await user.type(validConfirmPasswordInput, "User1234@");

    await user.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(mockHandleRegisterUser).toHaveBeenCalled();
      expect(mockClose).toHaveBeenCalled();
    });
  });
});
