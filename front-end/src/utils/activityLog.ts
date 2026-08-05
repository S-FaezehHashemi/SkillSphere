export type ActivityType = "login" | "upload" | "register" | "download";

export interface StoredActivity {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
}

const STORAGE_KEY = "skillsphere_activity_log";
const MAX_ENTRIES = 50;

function readLog(): StoredActivity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredActivity[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLog(entries: StoredActivity[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

export function getActivityLog(): StoredActivity[] {
  return readLog();
}

export function logActivity(
  entry: Omit<StoredActivity, "id" | "timestamp"> & {
    timestamp?: string;
  },
): StoredActivity {
  const record: StoredActivity = {
    id: crypto.randomUUID(),
    timestamp: entry.timestamp ?? new Date().toISOString(),
    type: entry.type,
    message: entry.message,
  };

  const next = [record, ...readLog()].slice(0, MAX_ENTRIES);
  writeLog(next);
  return record;
}

export function clearActivityLog() {
  localStorage.removeItem(STORAGE_KEY);
}
