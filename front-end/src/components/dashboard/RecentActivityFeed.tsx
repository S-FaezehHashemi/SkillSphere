import { Download, FolderUp, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import type { Notification, Project } from "../../types";
import { formatActivityDate } from "../../utils/format";

export interface ActivityItem {
  id: string;
  type: "upload" | "download" | "login" | "notification";
  message: string;
  timestamp: string;
  href?: string;
}

interface RecentActivityFeedProps {
  projects: Project[];
  notifications: Notification[];
}

function buildActivityItems(
  projects: Project[],
  notifications: Notification[],
): ActivityItem[] {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const projectItems: ActivityItem[] = safeProjects.map((p) => ({
    id: `project-${p.id}`,
    type: "upload" as const,
    message: `Project "${p.title}" uploaded`,
    timestamp: p.created_at,
    href: `/projects/${p.id}`,
  }));

  const notificationItems: ActivityItem[] = safeNotifications
    .slice(0, 5)
    .map((n) => ({
    id: `notification-${n.id}`,
    type: "notification" as const,
    message: n.message,
    timestamp: n.created_at,
    href: "/notifications",
  }));

  return [...projectItems, ...notificationItems]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 8);
}

const iconMap = {
  upload: FolderUp,
  download: Download,
  login: LogIn,
  notification: LogIn,
};

const colorMap = {
  upload: "text-accent bg-accent/20",
  download: "text-blue-400 bg-blue-500/20",
  login: "text-green-400 bg-green-500/20",
  notification: "text-amber-400 bg-amber-500/20",
};

export default function RecentActivityFeed({
  projects,
  notifications,
}: RecentActivityFeedProps) {
  const items = buildActivityItems(projects, notifications);

  return (
    <div className="rounded-xl border border-gray-800 bg-surface-card p-5 md:p-6">
      <h2 className="text-lg font-semibold text-white">Recent activity</h2>
      <p className="mt-1 text-sm text-gray-400">
        Latest uploads and notifications
      </p>

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">No recent activity yet.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {items.map((item) => {
            const Icon = iconMap[item.type];
            const content = (
              <>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colorMap[item.type]}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-200">{item.message}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {formatActivityDate(item.timestamp)}
                  </p>
                </div>
              </>
            );

            return (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    to={item.href}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/5"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 p-2">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
