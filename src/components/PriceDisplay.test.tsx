// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PriceDisplay } from "./PriceDisplay";

describe("PriceDisplay component", () => {
  it("should display discount price if exists", () => {
    render(<PriceDisplay discountPrice={200} price={220} />);
    expect(screen.getByTestId("discount-price")).toBeInTheDocument();
  });

  it("should just display original price", () => {
    render(<PriceDisplay price={220} />);
    expect(screen.getByTestId("original-price")).toBeInTheDocument();
  });
});
