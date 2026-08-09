import { useEffect, useRef, useState } from "react";
import { saveSearchHistory, SEARCH_HISTORY_KEY } from "../utils/searchHistory";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchDrawer = ({ isOpen, onClose }: SearchDrawerProps) => {
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  });

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    saveSearchHistory(trimmedQuery);

    const updatedHistory = JSON.parse(
      localStorage.getItem(SEARCH_HISTORY_KEY) ?? "[]",
    );
    setSearchHistory(updatedHistory);

    navigate(`product/search?q=${encodeURIComponent(trimmedQuery)}`);

    onClose();
    setQuery("");
  };

  const handleClearSearchHistory = () => {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    setSearchHistory([]);
  };

  const handleSelectHistoryQuery = (query: string) => {
    navigate(`product/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  return (
    <>
      {/* Search BackDrop*/}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 h-full z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto cursor-pointer"
            : "opacity-0 pointer-events-none"
        }`}
      />
      {/* Search Input*/}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full md:w-80 px-8 bg-white ${isOpen ? "opacity-100 visible " : "opacity-0 invisible"} duration-300 ease-in-out`}
      >
        <form
          onSubmit={handleSearch}
          className="flex flex-row gap-4 items-center"
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            type="text"
            className="w-full h-12 my-8 border-b border-gray-400  focus:outline-none"
            placeholder="Search..."
          />
          <button
            onClick={onClose}
            className="hover:text-gray-400 hover:cursor-pointer w-4 h-4"
          >
            <X />
          </button>
        </form>
        <div className="flex flex-row justify-between">
          <div className="font-bold">Search history</div>
          <button
            onClick={handleClearSearchHistory}
            className="underline hover:text-gray-400 hover:cursor-pointer"
          >
            Clear
          </button>
        </div>

        <div className="flex flex-col gap-2 items-start">
          {searchHistory.map((query, index) => (
            <button
              key={index}
              onClick={() => handleSelectHistoryQuery(query)}
              className="text-gray-600 hover:text-black hover:bg-gray-200 hover:cursor-pointer"
            >
              {query}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
