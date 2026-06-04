// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { describe, it, vi, beforeEach, expect, afterEach } from "vitest";
import { useRegisterUser } from "../hooks/useAuth";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { Register } from "./register";
import userEvent from "@testing-library/user-event";

vi.mock("../hooks/useAuth", () => ({
  useRegisterUser: vi.fn(),
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

  it("should display realtime username validation error as the user type", async () => {
    render(<Register />);
    const user = userEvent.setup();
    const userNameInput = screen.getByPlaceholderText(/^username$/i);

    await user.type(userNameInput, "a");
    await waitFor(() => {
      expect(
        screen.getByText(/Username must have at least 3 characters/i),
      ).toBeInTheDocument();
    });

    await user.clear(userNameInput);
    await user.type(userNameInput, "TheLongUserNameHasBeenCreated");
    await waitFor(() => {
      expect(
        screen.getByText(/Username must have at most 20 characters/i),
      ).toBeInTheDocument();
    });

    await user.clear(userNameInput);
    await user.type(userNameInput, "user*");
    await waitFor(() => {
      expect(
        screen.getByText(
          /Username must not have special characters \(except _ and -\)/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it("should display multiple realtime password validation errors as the user type", async () => {
    render(<Register />);
    const user = userEvent.setup();
    const passwordInput = screen.getByPlaceholderText(/^password$/i);

    await user.type(passwordInput, "a");
    await waitFor(() => {
      expect(
        screen.getByText(/Password must have at least 8 characters/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Password must have at least one uppercase letter/i),
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Password must have at least one number/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Password must have at least one special character/i),
      ).toBeInTheDocument();
    });

    await user.clear(passwordInput);
    await user.type(passwordInput, "MaiHoang");
    await waitFor(() => {
      expect(
        screen.getByText(/Password must have at least one number/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Password must have at least one special character/i),
      ).toBeInTheDocument();
    });
  });

  it("should display confirm password validation error as the user type", async () => {
    render(<Register />);
    const user = userEvent.setup();

    const validUserInput = screen.getByPlaceholderText(/^username$/i);
    const validPasswordInput = screen.getByPlaceholderText(/^password$/i);
    const wrongConfirmPasswordInput =
      screen.getByPlaceholderText(/^confirm password$/i);

    await user.type(validUserInput, "user123");
    await user.type(validPasswordInput, "User1234@");
    await user.type(wrongConfirmPasswordInput, "User12345");

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
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
    });
  });
});
