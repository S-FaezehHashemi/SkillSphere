import { Search } from "lucide-react";
import { useSearch } from "../../contexts/SearchContext";

export default function GlobalSearch() {
  const { query, setQuery } = useSearch();

  return (
    <div className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects, tags, users..."
        className="w-full rounded-lg border border-gray-700 bg-surface-elevated py-2 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
        aria-label="Global search"
      />
    </div>
  );
}
