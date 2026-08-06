import { useCallback, useState } from "react";

const STORAGE_KEY = "liked_projects";

function readLikes(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

function writeLikes(likes: Set<number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...likes]));
}

export function useLikes() {
  const [likedIds, setLikedIds] = useState<Set<number>>(() => readLikes());

  const isLiked = useCallback(
    (projectId: number) => likedIds.has(projectId),
    [likedIds],
  );

  const toggleLike = useCallback((projectId: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      writeLikes(next);
      return next;
    });
  }, []);

  return { isLiked, toggleLike, likedCount: likedIds.size };
}
