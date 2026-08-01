// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, vi, it, expect } from "vitest";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { screen, render, cleanup, waitFor } from "@testing-library/react";
import { LoginForm } from "./LoginForm";
import userEvent from "@testing-library/user-event";
import {
  runPasswordTests,
  runUsernameTests,
} from "@/features/auth/utils/__test__/authModalsTest";
import { useAuthModalStore } from "@/features/auth/stores/useAuthModalStore";
import { mockUserData } from "@/tests/mockData";

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useLogin: vi.fn(),
}));

const mockHandleLogin = vi.fn();
const setupMocks = (overrides = {}) => {
  vi.mocked(useLogin).mockReturnValue({
    mutate: mockHandleLogin,
    isPending: false,
    isError: false,
    error: null,
    ...overrides,
  } as unknown as ReturnType<typeof useLogin>);
};

vi.mock("@/components/Loading", () => ({
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
    setupMocks({});
    render(<LoginForm />);

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "here" })).toBeInTheDocument();
  });

  runUsernameTests(() => render(<LoginForm />));
  runPasswordTests(() => render(<LoginForm />));

  it("should switch to register modal on click", async () => {
    setupMocks({});
    render(<LoginForm />);

    expect(screen.getByRole("button", { name: "here" })).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "here" }));

    expect(useAuthModalStore.getState().authMode).toBe("register");
  });

  it("should keep the modal open and display error message on errors", async () => {
    setupMocks({ isError: true, error: new Error("Something went wrong") });
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
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });

  it("should submit the form and close on successful validation", async () => {
    setupMocks({});
    vi.mocked(mockHandleLogin).mockImplementation((_variables, options) => {
      options?.onSuccess?.(
        { user: mockUserData, accessToken: "token" }, // Mocked res data
        _variables, // Mocked variables
        undefined, // Context
      );
    });

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
    setupMocks({ isPending: true });

    render(<LoginForm />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
});
