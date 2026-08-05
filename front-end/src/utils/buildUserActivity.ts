import type { Project } from "../types";
import type { ActivityType, StoredActivity } from "./activityLog";

export interface UserActivityItem {
  id: string;
  type: ActivityType | "notification";
  message: string;
  timestamp: string;
  href?: string;
}

export function buildUserActivity(
  stored: StoredActivity[],
  projects: Project[],
): UserActivityItem[] {
  const uploadItems: UserActivityItem[] = projects.map((p) => ({
    id: `upload-api-${p.id}`,
    type: "upload" as const,
    message: `Uploaded project "${p.title}"`,
    timestamp: p.created_at,
    href: `/projects/${p.id}`,
  }));

  const storedItems: UserActivityItem[] = stored.map((entry) => ({
    id: entry.id,
    type: entry.type,
    message: entry.message,
    timestamp: entry.timestamp,
    href: entry.type === "upload" ? "/projects" : undefined,
  }));

  const merged = [...storedItems, ...uploadItems];
  const seen = new Set<string>();

  return merged
    .filter((item) => {
      const key = `${item.type}:${item.message}:${item.timestamp.slice(0, 16)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
}
