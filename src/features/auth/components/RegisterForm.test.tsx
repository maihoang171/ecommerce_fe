// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { describe, it, vi, beforeEach, expect, afterEach } from "vitest";
import { useRegisterUser } from "@/features/auth/hooks/useAuth";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { RegisterForm } from "./RegisterForm";
import userEvent from "@testing-library/user-event";
import {
  runPasswordTests,
  runUsernameTests,
} from "@/features/auth/utils/__test__/authModalsTest";

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useRegisterUser: vi.fn(),
}));

const mockHandleRegisterUser = vi.fn();
const setup = (overrides = {}) => {
  vi.mocked(useRegisterUser).mockReturnValue({
    mutate: mockHandleRegisterUser,
    isPending: false,
    isError: false,
    error: null,
    ...overrides,
  } as unknown as ReturnType<typeof useRegisterUser>);
};

const mockOpenLogin = vi.fn();
const mockClose = vi.fn();

vi.mock("@/features/auth/stores/useAuthModalStore", () => ({
  useAuthModalStore: () => ({
    openLogin: mockOpenLogin,
    close: mockClose,
  }),
}));

vi.mock("@/components/Loading", () => ({
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

  it("should render all elements properly", () => {
    setup();
    render(<RegisterForm />);
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Register" }),
    ).toBeInTheDocument();
  });

  runUsernameTests(() => render(<RegisterForm />));
  runPasswordTests(() => render(<RegisterForm />));

  it("should switch to login modal on click", async () => {
    setup();
    render(<RegisterForm />);
    expect(screen.getByRole("button", { name: "here" })).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "here" }));
    expect(mockOpenLogin).toHaveBeenCalled();
  });

  it("should submit the form and close modal on successful registration", async () => {
    setup();

    // Simulate TanStack Query calling onSuccess when mutate is invoked
    mockHandleRegisterUser.mockImplementation((_data, options) => {
      options?.onSuccess?.();
    });

    render(<RegisterForm />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/^username$/i), "user123");
    await user.type(screen.getByPlaceholderText(/^password$/i), "User1234@");
    await user.type(
      screen.getByPlaceholderText(/^confirm password$/i),
      "User1234@",
    );

    await user.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(mockHandleRegisterUser).toHaveBeenCalledWith(
        {
          username: "user123",
          password: "User1234@",
          confirmPassword: "User1234@",
        },
        expect.any(Object),
      );
      expect(mockClose).toHaveBeenCalled();
    });
  });

  it("should keep the modal open when registration fails", async () => {
    setup();

    mockHandleRegisterUser.mockImplementation((_data, options) => {
      options?.onError?.(new Error("Registration failed"));
    });

    render(<RegisterForm />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/^username$/i), "user123");
    await user.type(screen.getByPlaceholderText(/^password$/i), "User1234@");
    await user.type(
      screen.getByPlaceholderText(/^confirm password$/i),
      "User1234@",
    );

    await user.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(mockHandleRegisterUser).toHaveBeenCalled();
      expect(mockClose).not.toHaveBeenCalled();
    });
  });

  it("should display loading spinner when isPending is true", () => {
    setup({ isPending: true });

    render(<RegisterForm />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should display error message when an error occurred", () => {
    setup({
      isError: true,
      error: new Error("Something went wrong"),
    });

    render(<RegisterForm />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
