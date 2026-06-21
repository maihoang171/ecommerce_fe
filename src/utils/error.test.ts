import axios from "axios";
import { describe, it, vi, expect } from "vitest";
import { extractErrorMsg } from "../utils/error";

describe("extractErrorMessage utility", () => {
  it("should extract message from backend axios error", () => {
    vi.spyOn(axios, "isAxiosError").mockReturnValue(true);
    const err = {
      isAxiosError: true,
      response: {
        data: {
          message: "Backend error",
        },
      },
    };

    expect(extractErrorMsg(err)).toBe("Backend error");
  });

  it("should fallback when axios error has empty data", () => {
    vi.spyOn(axios, "isAxiosError").mockReturnValue(true);
    const err = {
      isAxiosError: true,
      response: {
        data: {},
      },
    };

    expect(extractErrorMsg(err)).toBe("Something went wrong");
  });

  it("should handle standard error instance", () => {
    vi.spyOn(axios, "isAxiosError").mockReturnValue(false);
    expect(extractErrorMsg(new Error("Local crash"))).toBe("Local crash");
  });

  it("should return default error message", () => {
    const err = "Something went wrong";
    expect(extractErrorMsg(err)).toBe(err);
  });
});
