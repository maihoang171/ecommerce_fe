// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, vi, it, expect } from "vitest";
import { useLogin } from "@/hooks/useAuth";
import { screen, render, cleanup, waitFor } from "@testing-library/react";
import { LoginForm } from "./LoginForm";
import userEvent from "@testing-library/user-event";
import {
  runPasswordTests,
  runUsernameTests,
} from "@/utils/__test__/authModalsTest";
import { useAuthModalStore } from "@/stores/useAuthModalStore";

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

vi.mock("@/components/Body/Loading", () => ({
  Loading: () => (
    <div data-testid="loading-spinner">Mock Loading Component</div>
  ),
}));

describe("Login component validation and submission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state before each test
    useAuthModalStore.setState({
      authMode: "login",
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("should render all elements property", () => {
    setup();
    render(<LoginForm />);

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "here" })).toBeInTheDocument();
  });

  runUsernameTests(() => render(<LoginForm />));
  runPasswordTests(() => render(<LoginForm />));

  it("should switch to register modal on click", async () => {
    setup();
    render(<LoginForm />);

    expect(screen.getByRole("button", { name: "here" })).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "here" }));

    expect(useAuthModalStore.getState().authMode).toBe("register");
  });

  it("should keep the modal open on errors", async () => {
    setup();
    useAuthModalStore.setState({ authMode: "login" });

    vi.mocked(mockHandleLogin).mockResolvedValue(false);

    render(<LoginForm />);

    const user = userEvent.setup();
    const validUserInput = screen.getByPlaceholderText(/^username$/i);
    const inValidPasswordInput = screen.getByPlaceholderText(/^password$/i);

    await user.type(validUserInput, "user123");
    await user.type(inValidPasswordInput, "User1234@");

    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalled();
      // Verify the store action didn't close the modal
      expect(useAuthModalStore.getState().authMode).toBe("login");
    });
  });

  it("should submit the form on successful validation", async () => {
    setup();
    vi.mocked(mockHandleLogin).mockResolvedValue(true);

    render(<LoginForm />);

    const user = userEvent.setup();
    const validUserInput = screen.getByPlaceholderText(/^username$/i);
    const validPasswordInput = screen.getByPlaceholderText(/^password$/i);

    await user.type(validUserInput, "user123");
    await user.type(validPasswordInput, "User1234@");

    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(useAuthModalStore.getState().authMode).toBeNull();
    });
  });

  it("should display loading spin when fetching data", () => {
    setup({ isLoading: true });

    render(<LoginForm />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should display error message on an error occurred", () => {
    setup({ errMsg: "Something went wrong" });

    render(<LoginForm />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
