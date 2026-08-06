import { Download, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useLikes } from "../../hooks/useLikes";
import type { Project } from "../../types";
import { formatMonthYear, getInitials } from "../../utils/format";
import { getProjectIcon, getProjectIconColor } from "../../utils/projectIcon";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { isLiked, toggleLike } = useLikes();
  const liked = isLiked(project.id);
  const Icon = getProjectIcon(project.tag_list);
  const iconColor = getProjectIconColor(project.tag_list);

  return (
    <article className="group flex flex-col rounded-xl border border-gray-800 bg-surface-card p-5 transition-colors hover:border-gray-700">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconColor}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleLike(project.id);
            }}
            className={[
              "rounded-lg p-2 transition-colors",
              liked
                ? "text-red-400 hover:text-red-300"
                : "text-gray-500 hover:bg-white/5 hover:text-red-400",
            ].join(" ")}
            aria-label={liked ? "Unlike project" : "Like project"}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          </button>
          {project.file_path && (
            <a
              href={project.file_path}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/5 hover:text-accent"
              aria-label="Download project file"
            >
              <Download className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <Link to={`/projects/${project.id}`} className="flex flex-1 flex-col">
        <h3 className="mb-2 text-base font-semibold text-white group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-400">
          {project.description || "No description provided."}
        </p>

        {project.tag_list.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.tag_list.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-surface-elevated px-2 py-0.5 text-xs text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-800 pt-4 text-xs text-gray-500">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent"
            title={project.owner.full_name}
          >
            {getInitials(project.owner.full_name)}
          </span>
          <time dateTime={project.created_at}>
            {formatMonthYear(project.created_at)}
          </time>
        </div>
      </Link>
    </article>
  );
}
