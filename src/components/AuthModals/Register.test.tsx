// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { describe, it, vi, beforeEach, expect, afterEach } from "vitest";
import { useRegisterUser } from "@/hooks/useAuth";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { Register } from "./Register";
import userEvent from "@testing-library/user-event";
import {
  runPasswordTests,
  runUsernameTests,
} from "@/utils/__test__/authModalsTest";

vi.mock("@/hooks/useAuth", () => ({
  useRegisterUser: vi.fn(),
}));

const mockUserRegisterUser = vi.mocked(useRegisterUser);
const mockHandleRegisterUser = vi.fn();
const setup = (overrides = {}) => {
  mockUserRegisterUser.mockReturnValue({
    handleRegisterUser: mockHandleRegisterUser,
    isLoading: false,
    errMsg: null,
    ...overrides,
  });
};

const mockOpenLogin = vi.fn();
const mockClose = vi.fn();
vi.mock("@/stores/useAuthModelStore", () => ({
  useAuthModalStore: () => ({
    openLogin: mockOpenLogin,
    close: mockClose,
  }),
}));

vi.mock("@/components/Body/Loading", () => ({
  Loading: () => (
    <div data-testid="loading-spinner">Mock Loading Component</div>
  ),
}));

describe("register component validation and submission", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all elements property", () => {
    setup();
    render(<Register />);
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Register" }),
    ).toBeInTheDocument();
  });

  runUsernameTests(() => render(<Register />));
  runPasswordTests(() => render(<Register />));

  it("should switch to login modal on click", async () => {
    setup();
    render(<Register />);
    expect(screen.getByRole("button", { name: "here" })).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "here" }));
    expect(mockOpenLogin).toHaveBeenCalled();
  });

  it("should submit the form on successful validation", async () => {
    setup();
    vi.mocked(mockHandleRegisterUser).mockResolvedValue(true);

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

  it("should keep the modal open when can not submit", async () => {
    setup();
    vi.mocked(mockHandleRegisterUser).mockResolvedValue(false);

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
      expect(mockClose).not.toHaveBeenCalled();
    });
  });

  it("should display loading spinner when isLoading is true", () => {
    setup({ isLoading: true });

    render(<Register />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should display error message when an error occurred", async () => {
    setup({ errMsg: "Something went wrong" });

    render(<Register />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
