// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Loading } from "./Loading";

describe("Loading component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render with default h-[80vh] class with no className is provided", () => {
    render(<Loading />);

    const loader = screen.getByRole("status");
    expect(loader).toHaveClass("h-[80vh]");
  });

  it("should display custom Classname when provided", () => {
    const customClassname = "h-50";
    render(<Loading className={customClassname} />);

    const loader = screen.getByRole("status");
    expect(loader).toHaveClass("h-50");
    expect(loader).not.toHaveClass("h-[80vh]");
  });
});
