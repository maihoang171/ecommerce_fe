//@vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SearchDrawer } from "./SearchDrawer";
import { act } from "react";
import { SEARCH_HISTORY_KEY } from "@/utils/searchHistory";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Search Drawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.restoreAllMocks();

    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const mockOnClose = vi.fn();
  it("should display all element, existing history and focus on input onsuccess", () => {
    const mockSearchHistory = ["shirt", "pant"];

    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(
      JSON.stringify(mockSearchHistory),
    );

    render(<SearchDrawer isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText(/search/i);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByTestId("back-drop")).toBeInTheDocument();
    expect(screen.getByText(mockSearchHistory[1])).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it("should return empty array when search history is empty and close search drawer when clicked X", () => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

    render(<SearchDrawer isOpen={true} onClose={mockOnClose} />);

    const closeBtn = screen.getByTestId("close-btn");

    fireEvent.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should not display search drawer when isOpen is false", () => {
    render(<SearchDrawer isOpen={false} onClose={mockOnClose} />);

    expect(screen.getByTestId("back-drop")).toHaveClass(
      "opacity-0",
      "pointer-events-none",
    );
  });

  it("should navigate when click a search history query", () => {
    const mockSearchHistory = ["shirt", "pant"];

    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(
      JSON.stringify(mockSearchHistory),
    );

    render(<SearchDrawer isOpen={true} onClose={mockOnClose} />);

    const firstQueryBtn = screen.getByRole("button", {
      name: mockSearchHistory[0],
    });

    fireEvent.click(firstQueryBtn);

    expect(mockNavigate).toHaveBeenCalledWith(
      `product/search?q=${encodeURIComponent(mockSearchHistory[0])}`,
    );

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should clear all search history when clicked", () => {
    const mockSearchHistory = ["shirt", "pant"];

    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(
      JSON.stringify(mockSearchHistory),
    );
    const removeStorage = vi.spyOn(Storage.prototype, "removeItem");

    render(<SearchDrawer isOpen={true} onClose={mockOnClose} />);

    const clearBtn = screen.getByRole("button", { name: /clear/i });
    fireEvent.click(clearBtn);

    expect(removeStorage).toHaveBeenCalledWith(SEARCH_HISTORY_KEY);
  });

  it("should navigate to search page, close search drawer when submit success", () => {
    render(<SearchDrawer isOpen={true} onClose={mockOnClose} />);

    const form = screen.getByTestId("search-form");

    const input = screen.getByPlaceholderText(/search/i);
    const mockInput = "shirt";
    fireEvent.change(input, { target: { value: mockInput } });

    expect(input).toHaveValue(mockInput);

    fireEvent.submit(form);

    expect(screen.getByRole("button", { name: "shirt" })).toBeInTheDocument();
  });

  it("should fallback to empty array when getItem returns null during handleSearch", () => {
    render(<SearchDrawer isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText(/search/i);
    const form = screen.getByTestId("search-form");

    fireEvent.change(input, { target: { value: "pants" } });

    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

    fireEvent.submit(form);

    expect(mockNavigate).toHaveBeenCalledWith("product/search?q=pants");
    expect(mockOnClose).toHaveBeenCalled();
  });
});
