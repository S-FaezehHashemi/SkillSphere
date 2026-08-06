import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchMyProjects } from "../api/projects";
import ActivityLog from "../components/profile/ActivityLog";
import ProfileCard from "../components/profile/ProfileCard";
import { useAuth } from "../hooks/useAuth";
import type { Project } from "../types";
import { getActivityLog } from "../utils/activityLog";
import { buildUserActivity } from "../utils/buildUserActivity";

export default function ProfilePage() {
  const { user, fetchMe, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityVersion, setActivityVersion] = useState(0);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchMe();
      const data = await fetchMyProjects();
      setProjects(data.results);
      setActivityVersion((v) => v + 1);
    } catch {
      setError("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  }, [fetchMe]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activityItems = useMemo(() => {
    void activityVersion;
    return buildUserActivity(getActivityLog(), projects);
  }, [projects, activityVersion]);

  if (authLoading || (loading && !user)) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        Unable to load your profile.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Profile</h1>
        <p className="mt-1 text-sm text-gray-400">
          Your account details and activity history
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <ProfileCard user={user} projectCount={projects.length} />
        </div>
        <div className="xl:col-span-3">
          <ActivityLog items={activityItems.slice(0, 20)} />
        </div>
      </div>
    </div>
  );
}
