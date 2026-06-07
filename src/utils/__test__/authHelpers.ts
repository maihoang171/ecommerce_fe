import { it, expect } from "vitest"
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const runUserNameTests = (renderComponents: () => void) => {
    it("should display realtime username validation error as the user type", async () => {
        renderComponents()
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
}

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
}
