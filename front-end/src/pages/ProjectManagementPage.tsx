import { useCallback, useEffect, useState } from "react";
import { fetchMyProjects } from "../api/projects";
import ProjectDataGrid from "../components/projects/ProjectDataGrid";
import ProjectUploadForm from "../components/projects/ProjectUploadForm";
import type { Project } from "../types";

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyProjects();
      setProjects(data.results);
    } catch {
      setError("Failed to load your projects.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  function handleUploadSuccess() {
    setSuccessMessage("Project uploaded successfully!");
    loadProjects();
    setTimeout(() => setSuccessMessage(null), 4000);
  }

  function handleDeleted(id: number) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          Project management
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Upload new projects and manage your submissions
        </p>
      </div>

      {successMessage && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {successMessage}
        </div>
      )}

      <ProjectUploadForm onSuccess={handleUploadSuccess} />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Your projects</h2>
          <span className="text-sm text-gray-400">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : (
          <ProjectDataGrid projects={projects} onDeleted={handleDeleted} />
        )}
      </section>
    </div>
  );
}
