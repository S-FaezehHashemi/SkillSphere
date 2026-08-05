import { CheckCheck, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../api/notifications";
import type { Notification } from "../../types";
import { dispatchNotificationsUpdated } from "../../utils/notificationEvents";
import {
  categorizeNotification,
  CATEGORY_META,
  type NotificationCategory,
} from "../../utils/notificationCategory";
import NotificationItem from "./NotificationItem";

type FilterValue = "all" | "unread" | NotificationCategory;

interface NotificationFeedProps {
  /** When true, hides the page header (for embedding elsewhere). */
  embedded?: boolean;
}

export default function NotificationFeed({
  embedded = false,
}: NotificationFeedProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch {
      setError("Failed to load notifications.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications],
  );

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === "all") return true;
      if (filter === "unread") return !n.is_read;
      return categorizeNotification(n.message) === filter;
    });
  }, [notifications, filter]);

  async function handleMarkRead(id: number) {
    setMarkingId(id);
    try {
      const updated = await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? updated : n)),
      );
      dispatchNotificationsUpdated();
    } catch {
      setError("Failed to mark notification as read.");
    } finally {
      setMarkingId(null);
    }
  }

  async function handleMarkAllRead() {
    if (unreadCount === 0) return;
    setMarkingAll(true);
    setError(null);
    try {
      const updated = await markAllNotificationsRead(notifications);
      const updatedMap = new Map(updated.map((n) => [n.id, n]));
      setNotifications((prev) =>
        prev.map((n) => updatedMap.get(n.id) ?? { ...n, is_read: true }),
      );
      dispatchNotificationsUpdated();
    } catch {
      setError("Failed to mark all notifications as read.");
    } finally {
      setMarkingAll(false);
    }
  }

  const filterOptions: { value: FilterValue; label: string }[] = [
    { value: "all", label: "All" },
    { value: "unread", label: `Unread (${unreadCount})` },
    ...(
      Object.entries(CATEGORY_META) as [
        NotificationCategory,
        (typeof CATEGORY_META)[NotificationCategory],
      ][]
    ).map(([value, meta]) => ({ value, label: meta.label })),
  ];

  return (
    <div className="space-y-5">
      {!embedded && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              {unreadCount} unread · {notifications.length} total
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-gray-600 hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={markingAll || unreadCount === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {markingAll ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4" />
              )}
              Mark all as read
            </button>
          </div>
        </div>
      )}

      {embedded && unreadCount > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-muted disabled:opacity-50"
          >
            {markingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            Mark all as read
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={[
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              filter === option.value
                ? "bg-accent text-white"
                : "border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200",
            ].join(" ")}
          >
            {option.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 py-16 text-center">
          <p className="text-gray-400">
            {filter === "unread"
              ? "You're all caught up — no unread notifications."
              : "No notifications in this category."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
              marking={markingId === notification.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
