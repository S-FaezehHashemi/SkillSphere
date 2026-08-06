import {
  ArrowLeft,
  Download,
  ExternalLink,
  Heart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProject } from "../api/projects";
import { useLikes } from "../hooks/useLikes";
import type { Project } from "../types";
import { formatMonthYear, getInitials } from "../utils/format";
import { getProjectIcon, getProjectIconColor } from "../utils/projectIcon";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isLiked, toggleLike } = useLikes();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProject(Number(id))
      .then(setProject)
      .catch(() => setError("Project not found or failed to load."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error ?? "Project not found."}
        </div>
      </div>
    );
  }

  const liked = isLiked(project.id);
  const Icon = getProjectIcon(project.tag_list);
  const iconColor = getProjectIconColor(project.tag_list);
  const isImage =
    project.file_path &&
    /\.(png|jpe?g)$/i.test(project.file_path);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div className="rounded-xl border border-gray-800 bg-surface-card p-6 md:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${iconColor}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{project.title}</h1>
              <p className="mt-1 text-sm text-gray-400">
                Created {formatMonthYear(project.created_at)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => toggleLike(project.id)}
              className={[
                "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                liked
                  ? "border-red-500/50 bg-red-500/10 text-red-400"
                  : "border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white",
              ].join(" ")}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              {liked ? "Liked" : "Like"}
            </button>

            {project.file_path && (
              <a
                href={project.file_path}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-muted"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            )}
          </div>
        </div>

        <p className="mb-6 leading-relaxed text-gray-300">
          {project.description || "No description provided."}
        </p>

        {project.tag_list.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {project.tag_list.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-700 px-3 py-1 text-sm capitalize text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 border-t border-gray-800 pt-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
            {getInitials(project.owner.full_name)}
          </span>
          <div>
            <p className="font-medium text-white">{project.owner.full_name}</p>
            <p className="text-sm text-gray-400">{project.owner.email}</p>
          </div>
        </div>

        {isImage && (
          <div className="mt-6 overflow-hidden rounded-lg border border-gray-800">
            <img
              src={project.file_path!}
              alt={project.title}
              className="max-h-96 w-full object-contain bg-surface-elevated"
            />
          </div>
        )}

        {project.file_path && !isImage && (
          <a
            href={project.file_path}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-accent hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Open attached file
          </a>
        )}
      </div>
    </div>
  );
}
