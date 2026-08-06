import { useSearch } from "../../contexts/SearchContext";

interface TagFilterBarProps {
  tags: string[];
}

export default function TagFilterBar({ tags }: TagFilterBarProps) {
  const { selectedTag, setSelectedTag } = useSearch();

  const pills = ["All", ...tags];

  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((tag) => {
        const isAll = tag === "All";
        const isActive = isAll ? !selectedTag : selectedTag === tag;

        return (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(isAll ? null : tag)}
            className={[
              "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors",
              isActive
                ? "bg-accent text-white"
                : "border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200",
            ].join(" ")}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
