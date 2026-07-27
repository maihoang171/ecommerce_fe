// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServerError } from "./ServerError";

describe("ServerError Component", () => {
  it("should render default message when no prop is provided", () => {
    render(<ServerError />);

    expect(screen.getByText("Internal server error!")).toBeInTheDocument();
  });

  it("should render custom message when passed as a prop", () => {
    const customMessage = "Failed to load resource";
    render(<ServerError message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});
