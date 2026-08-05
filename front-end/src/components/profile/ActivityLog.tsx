import {
  Download,
  FolderUp,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { UserActivityItem } from "../../utils/buildUserActivity";
import { formatActivityDateTime } from "../../utils/format";

interface ActivityLogProps {
  items: UserActivityItem[];
}

const iconMap = {
  login: LogIn,
  upload: FolderUp,
  register: UserPlus,
  download: Download,
  notification: LogIn,
};

const labelMap: Record<UserActivityItem["type"], string> = {
  login: "Login",
  upload: "Upload",
  register: "Register",
  download: "Download",
  notification: "Alert",
};

const colorMap: Record<UserActivityItem["type"], string> = {
  login: "text-green-400 bg-green-500/20",
  upload: "text-accent bg-accent/20",
  register: "text-blue-400 bg-blue-500/20",
  download: "text-orange-400 bg-orange-500/20",
  notification: "text-amber-400 bg-amber-500/20",
};

export default function ActivityLog({ items }: ActivityLogProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-surface-card p-5 md:p-6">
      <h2 className="text-lg font-semibold text-white">Activity log</h2>
      <p className="mt-1 text-sm text-gray-400">
        Recent logins, uploads, and account actions
      </p>

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">
          No activity recorded yet. Sign in or upload a project to get started.
        </p>
      ) : (
        <div className="mt-5 overflow-hidden rounded-lg border border-gray-800">
          <ul className="divide-y divide-gray-800">
            {items.map((item) => {
              const Icon = iconMap[item.type];
              const row = (
                <>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colorMap[item.type]}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-surface-elevated px-2 py-0.5 text-xs font-medium text-gray-400">
                        {labelMap[item.type]}
                      </span>
                      <p className="truncate text-sm text-gray-200">
                        {item.message}
                      </p>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {formatActivityDateTime(item.timestamp)}
                    </p>
                  </div>
                </>
              );

              return (
                <li key={item.id}>
                  {item.href ? (
                    <Link
                      to={item.href}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]"
                    >
                      {row}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3">
                      {row}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
