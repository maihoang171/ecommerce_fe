// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { saveSearchHistory, SEARCH_HISTORY_KEY } from "./searchHistory";

describe("saveSearchHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should prepend new query into existing history array", () => {
    const mockExistingHistory = ["shirt", "polo"];
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(
      JSON.stringify(mockExistingHistory),
    );

    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    const mockQuery = "pant";
    saveSearchHistory(mockQuery);

    expect(setItemSpy).toHaveBeenCalledWith(
      SEARCH_HISTORY_KEY,
      JSON.stringify([mockQuery, ...mockExistingHistory]),
    );
  });

  it("should save new search query when history is empty", () => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    const mockQuery = "pant";
    saveSearchHistory(mockQuery);

    expect(setItemSpy).toHaveBeenCalledWith(
      SEARCH_HISTORY_KEY,
      JSON.stringify([mockQuery]),
    );
  });
});
