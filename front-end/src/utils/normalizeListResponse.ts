import type { PaginatedResponse } from "../types";

export function normalizeListResponse<T>(
  data: T[] | PaginatedResponse<T> | null | undefined,
): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (
    typeof data === "object" &&
    "results" in data &&
    Array.isArray(data.results)
  ) {
    return data.results;
  }
  return [];
}
