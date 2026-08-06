import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProjects } from "../api/projects";
import ProjectGrid from "../components/projects/ProjectGrid";
import TagFilterBar from "../components/projects/TagFilterBar";
import { useSearch } from "../contexts/SearchContext";
import type { Project } from "../types";
import {
  extractUniqueTags,
  filterProjects,
} from "../utils/filterProjects";

export default function ProjectsPage() {
  const { query, selectedTag } = useSearch();
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async (pageNum: number, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjects(pageNum);
      setProjects((prev) =>
        append ? [...prev, ...data.results] : data.results,
      );
      setTotalCount(data.count);
      setHasNext(Boolean(data.next));
      setPage(pageNum);
    } catch {
      setError("Failed to load projects. Make sure the backend is running.");
      if (!append) setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const allTags = useMemo(() => extractUniqueTags(projects), [projects]);

  const filteredProjects = useMemo(
    () => filterProjects(projects, query, selectedTag),
    [projects, query, selectedTag],
  );

  const showingLabel =
    query || selectedTag
      ? `Showing ${filteredProjects.length} of ${projects.length} loaded projects`
      : `Showing ${projects.length} of ${totalCount} projects`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            All projects
          </h1>
          <p className="mt-1 text-sm text-gray-400">{showingLabel}</p>
        </div>
        <Link
          to="/projects"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-gray-500 hover:bg-white/5"
        >
          <Plus className="h-4 w-4" />
          New project
        </Link>
      </div>

      <TagFilterBar tags={allTags} />

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && projects.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      ) : (
        <>
          <ProjectGrid projects={filteredProjects} />

          {hasNext && !query && !selectedTag && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() => loadPage(page + 1, true)}
                disabled={loading}
                className="rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-gray-600 hover:text-white disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load more projects"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
