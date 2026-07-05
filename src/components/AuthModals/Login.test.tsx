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

const mockUseLogin = vi.mocked(useLogin);
const mockHandleLogin = vi.fn();
const setup = (overrides = {}) => {
  mockUseLogin.mockReturnValue({
    handleLogin: mockHandleLogin,
    isLoading: false,
    errMsg: null,
    ...overrides,
  });
};

const mockOpenRegister = vi.fn();
const mockClose = vi.fn();
vi.mock("@/stores/useAuthModelStore", () => ({
  useAuthModalStore: () => ({
    openRegister: mockOpenRegister,
    close: mockClose,
  }),
}));

vi.mock("@/components/Body/Loading", () => ({
  Loading: () => (
    <div data-testid="loading-spinner">Mock Loading Component</div>
  ),
}));

describe("Login component validation and submission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render all elements property", () => {
    setup();
    render(<Login />);

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "here" }));
  });

  runUsernameTests(() => render(<Login />));
  runPasswordTests(() => render(<Login />));

  it("should switch to register modal on click", async () => {
    setup();
    render(<Login />);

    expect(screen.getByRole("button", { name: "here" })).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "here" }));

    expect(mockOpenRegister).toHaveBeenCalled();
  });

  it("should keep the modal open on errors", async () => {
    setup();

    vi.mocked(mockHandleLogin).mockResolvedValue(false);

    render(<Login />);

    const user = userEvent.setup();
    const validUserInput = screen.getByPlaceholderText(/^username$/i);
    const inValidPasswordInput = screen.getByPlaceholderText(/^password$/i);

    await user.type(validUserInput, "user123");
    await user.type(inValidPasswordInput, "User1234@");

    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalled();
      expect(mockClose).not.toHaveBeenCalled();
    });
  });

  it("should submit the form on successful validation", async () => {
    setup();
    vi.mocked(mockHandleLogin).mockResolvedValue(true);

    render(<Login />);

    const user = userEvent.setup();
    const validUserInput = screen.getByPlaceholderText(/^username$/i);
    const validPasswordInput = screen.getByPlaceholderText(/^password$/i);

    await user.type(validUserInput, "user123");
    await user.type(validPasswordInput, "User1234@");

    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockClose).toHaveBeenCalled();
    });
  });

  it("should display loading spin when fetching data", () => {
    setup({ isLoading: true });

    render(<Login />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should display error message on an error occurred", () => {
    setup({ errMsg: "Something went wrong" });

    render(<Login />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
