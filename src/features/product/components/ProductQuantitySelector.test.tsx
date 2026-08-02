// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProductQuantitySelector } from "./ProductQuantitySelector";
import userEvent from "@testing-library/user-event";

describe("ProductQuantitySelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const mockOnQuantityChange = vi.fn();
  const mockStockQuantity = 3;
  const setupMocks = ({ mockQuantity = 1 }) => {
    render(
      <ProductQuantitySelector
        quantity={mockQuantity}
        stockQuantity={mockStockQuantity}
        onQuantityChange={mockOnQuantityChange}
      />,
    );
  };

  it("should display all element on success", () => {
    setupMocks({});

    expect(
      screen.getByRole("button", { name: /minus-btn/i }),
    ).toBeInTheDocument();

    const input = screen.getByTestId("quantity-input");
    expect(input).toHaveValue(1);
    expect(
      screen.getByRole("button", { name: /plus-btn/i }),
    ).toBeInTheDocument();
  });

  it("should decrease when click minus-btn", async () => {
    setupMocks({ mockQuantity: 2 });

    const user = userEvent.setup();

    const minusBtn = screen.getByRole("button", { name: /minus-btn/i });

    await user.click(minusBtn);

    expect(mockOnQuantityChange).toHaveBeenCalledWith(1);
  });

  it("should increase to 2 when click plus-btn", async () => {
    setupMocks({});

    const user = userEvent.setup();

    const plusBtn = screen.getByRole("button", { name: /plus-btn/i });

    await user.click(plusBtn);

    expect(mockOnQuantityChange).toHaveBeenCalledWith(2);
  });

  it("should display 1 when user type invalid input", async () => {
    setupMocks({});

    const input = screen.getByTestId("quantity-input");

    fireEvent.change(input, {
      target: { value: "" },
    });

    expect(mockOnQuantityChange).toHaveBeenCalledWith(1);
  });

  it("should display 1 when user type value smaller than 1", async () => {
    setupMocks({});

    const input = screen.getByTestId("quantity-input");

    fireEvent.change(input, {
      target: { value: 0 },
    });

    expect(mockOnQuantityChange).toHaveBeenCalledWith(1);
  });

  it("should display stockQuantity when user type value larger than stockQuantity", async () => {
    setupMocks({});

    const input = screen.getByTestId("quantity-input");

    fireEvent.change(input, {
      target: { value: 4 },
    });

    expect(mockOnQuantityChange).toHaveBeenCalledWith(mockStockQuantity);
  });

  it("should display valid user value", async () => {
    setupMocks({});

    const input = screen.getByTestId("quantity-input");

    fireEvent.change(input, {
      target: { value: 3 },
    });

    expect(mockOnQuantityChange).toHaveBeenCalledWith(3);
  });
});
