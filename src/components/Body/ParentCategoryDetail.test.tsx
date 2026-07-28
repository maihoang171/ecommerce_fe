// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ParentCategoryDetail } from "./ParentCategoryDetail";
import userEvent from "@testing-library/user-event";
import { mockCategoryList } from "@/tests/mock/mockData";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => {
  const actual = vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ParentCategoryDetail component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const mockCategoryPayload = mockCategoryList[0]

  it("should display child categories on success", () => {
    render(<ParentCategoryDetail category={mockCategoryPayload} />);

    expect(screen.getByRole("img", { name: /Dresses/i })).toHaveAttribute(
      "src",
      mockCategoryPayload.children[0].imageUrl,
    );
    expect(screen.getByRole("img", { name: /Tops/i })).toHaveAttribute(
      "src",
      mockCategoryPayload.children[1].imageUrl,
    );
    expect(screen.getByRole("img", { name: /Bottoms/i })).toHaveAttribute(
      "src",
      mockCategoryPayload.children[2].imageUrl,
    );

    expect(screen.getByText("Dresses")).toBeInTheDocument();
    expect(screen.getByText("Tops")).toBeInTheDocument();
    expect(screen.getByText("Bottoms")).toBeInTheDocument();
  });

  it("should navigate to product list page on user click", async () => {
    render(<ParentCategoryDetail category={mockCategoryPayload} />);

    const user = userEvent.setup();

    const dressesBtn = screen.getByRole("button", { name: /dresses/i });

    await user.click(dressesBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/women/dresses");
  });
});
