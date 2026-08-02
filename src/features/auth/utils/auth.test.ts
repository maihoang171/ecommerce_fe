import { describe, expect, it } from "vitest";
import { getInitials } from "./auth";

describe("getInitials utility", () => {
  it("should return the first letter of a username in uppercase", () => {
    expect(getInitials("john")).toBe("J");
    expect(getInitials("Alice")).toBe("A");
  });

  it("should trim whitespace and return the first letter uppercase", () => {
    expect(getInitials("  bob  ")).toBe("B");
  });

  it("should return 'U' as a fallback when username is empty string", () => {
    expect(getInitials("")).toBe("U");
  });
});
