import { it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const runUsernameTests = (renderComponents: () => void) => {
  it("should display realtime username validation error as the user type", async () => {
    renderComponents();
    const user = userEvent.setup();
    const usernameInput = screen.getByPlaceholderText(/^username$/i);

    await user.type(usernameInput, "a");
    await waitFor(() => {
      expect(
        screen.getByText(/Username must have at least 3 characters/i),
      ).toBeInTheDocument();
    });

    await user.clear(usernameInput);
    await user.type(usernameInput, "TheLongUsernameHasBeenCreated");
    await waitFor(() => {
      expect(
        screen.getByText(/Username must have at most 20 characters/i),
      ).toBeInTheDocument();
    });

    await user.clear(usernameInput);
    await user.type(usernameInput, "user*");
    await waitFor(() => {
      expect(
        screen.getByText(
          /Username must not have special characters \(except _ and -\)/i,
        ),
      ).toBeInTheDocument();
    });
  });
};

export const runPasswordTests = (renderComponents: () => void) => {
  it("should display multiple realtime password validation errors as the user type", async () => {
    renderComponents();
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
};
