export const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY_ITEMS = 5;

export const saveSearchHistory = (newQuery: string) => {
  const existing = localStorage.getItem(SEARCH_HISTORY_KEY);
  const history: string[] = existing ? JSON.parse(existing) : [];

  const updateHistory = [
    newQuery,
    ...history
      .filter(
        (item) => item.toLocaleLowerCase() !== newQuery.toLocaleLowerCase(),
      )
      .slice(0, MAX_HISTORY_ITEMS),
  ];

  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updateHistory));
};
