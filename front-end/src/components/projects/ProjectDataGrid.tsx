import { Download, ExternalLink, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { deleteProject } from "../../api/projects";
import type { Project } from "../../types";
import { formatActivityDate } from "../../utils/format";
import { logActivity } from "../../utils/activityLog";

interface ProjectDataGridProps {
  projects: Project[];
  onDeleted: (id: number) => void;
}

export default function ProjectDataGrid({
  projects,
  onDeleted,
}: ProjectDataGridProps) {
  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteProject(id);
      onDeleted(id);
    } catch {
      window.alert("Failed to delete project.");
    }
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-700 bg-surface-card/50 py-12 text-center">
        <p className="text-gray-400">You haven&apos;t uploaded any projects yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-surface-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-surface-elevated/50">
              <th className="px-4 py-3 font-medium text-gray-400">Title</th>
              <th className="px-4 py-3 font-medium text-gray-400">Tags</th>
              <th className="hidden px-4 py-3 font-medium text-gray-400 md:table-cell">
                Created
              </th>
              <th className="px-4 py-3 font-medium text-gray-400">File</th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="transition-colors hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3">
                  <Link
                    to={`/projects/${project.id}`}
                    className="font-medium text-white hover:text-accent"
                  >
                    {project.title}
                  </Link>
                  {project.description && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                      {project.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {project.tag_list.length > 0 ? (
                      project.tag_list.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-surface-elevated px-2 py-0.5 text-xs text-gray-300"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-gray-400 md:table-cell">
                  {formatActivityDate(project.created_at)}
                </td>
                <td className="px-4 py-3">
                  {project.file_path ? (
                    <span className="text-xs text-green-400">Attached</span>
                  ) : (
                    <span className="text-xs text-gray-500">None</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {project.file_path ? (
                      <a
                        href={project.file_path}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          logActivity({
                            type: "download",
                            message: `Downloaded "${project.title}"`,
                          })
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:border-accent hover:text-accent"
                        title="Download file"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </a>
                    ) : (
                      <span className="px-3 py-1.5 text-xs text-gray-600">
                        No file
                      </span>
                    )}
                    <Link
                      to={`/projects/${project.id}`}
                      className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
                      title="View project"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id, project.title)}
                      className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
