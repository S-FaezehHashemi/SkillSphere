import {
  AlertCircle,
  CheckCircle2,
  Mail,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Notification } from "../../types";
import { formatActivityDateTime } from "../../utils/format";
import {
  categorizeNotification,
  type NotificationCategory,
} from "../../utils/notificationCategory";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: number) => void;
  marking: boolean;
}

const categoryStyles: Record<
  NotificationCategory,
  { icon: LucideIcon; className: string }
> = {
  system_success: {
    icon: CheckCircle2,
    className: "text-green-400 bg-green-500/20 border-green-500/30",
  },
  system_error: {
    icon: AlertCircle,
    className: "text-red-400 bg-red-500/20 border-red-500/30",
  },
  project_approval: {
    icon: ShieldCheck,
    className: "text-blue-400 bg-blue-500/20 border-blue-500/30",
  },
  comment: {
    icon: MessageSquare,
    className: "text-purple-400 bg-purple-500/20 border-purple-500/30",
  },
  invitation: {
    icon: Mail,
    className: "text-amber-400 bg-amber-500/20 border-amber-500/30",
  },
  general: {
    icon: CheckCircle2,
    className: "text-gray-400 bg-gray-500/20 border-gray-500/30",
  },
};

export default function NotificationItem({
  notification,
  onMarkRead,
  marking,
}: NotificationItemProps) {
  const category = categorizeNotification(notification.message);
  const { icon: Icon, className } = categoryStyles[category];

  return (
    <article
      className={[
        "rounded-xl border p-4 transition-colors",
        notification.is_read
          ? "border-gray-800 bg-surface-card/50 opacity-75"
          : "border-gray-700 bg-surface-card",
      ].join(" ")}
    >
      <div className="flex gap-4">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${className}`}
        >
          <Icon className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-sm leading-relaxed text-gray-200">
              {notification.message}
            </p>
            {!notification.is_read && (
              <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">
                New
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <time
              dateTime={notification.created_at}
              className="text-xs text-gray-500"
            >
              {formatActivityDateTime(notification.created_at)}
            </time>

            {!notification.is_read && (
              <button
                type="button"
                onClick={() => onMarkRead(notification.id)}
                disabled={marking}
                className="text-xs font-medium text-accent hover:text-accent-muted disabled:opacity-50"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
