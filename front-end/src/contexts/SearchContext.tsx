import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface SearchContextValue {
  query: string;
  setQuery: (query: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const value = useMemo(
    () => ({ query, setQuery, selectedTag, setSelectedTag }),
    [query, selectedTag],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}
