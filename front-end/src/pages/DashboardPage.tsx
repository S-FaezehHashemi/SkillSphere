import {
  Activity,
  Download,
  FolderKanban,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchDashboardAnalytics } from "../api/analytics";
import { fetchNotifications } from "../api/notifications";
import ActivityChart from "../components/dashboard/ActivityChart";
import MetricCard from "../components/dashboard/MetricCard";
import RecentActivityFeed from "../components/dashboard/RecentActivityFeed";
import { useAuth } from "../hooks/useAuth";
import type { DashboardAnalytics, Notification } from "../types";
import {
  getMockRecentActivityCount,
  getMockTotalDownloads,
} from "../utils/mockActivityData";

export default function DashboardPage() {
  const { user, isSimulatedSession } = useAuth();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [dashboard, notifs] = await Promise.all([
          fetchDashboardAnalytics(),
          fetchNotifications(),
        ]);
        setAnalytics(dashboard);
        setNotifications(notifs);
      } catch {
        if (isSimulatedSession) {
          setAnalytics({
            total_projects: 0,
            unread_notifications: 0,
            total_notifications: 0,
            recent_projects: [],
          });
          setNotifications([]);
        } else {
          setError("Failed to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isSimulatedSession]);

  const totalProjects = analytics?.total_projects ?? 0;
  const totalDownloads = getMockTotalDownloads();
  const recentActivityCount = analytics
    ? analytics.recent_projects.length + analytics.unread_notifications
    : getMockRecentActivityCount();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Welcome back{user ? `, ${user.full_name.split(" ")[0]}` : ""}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Total projects"
          value={totalProjects}
          icon={FolderKanban}
          trend={`${analytics?.recent_projects.length ?? 0} recent uploads`}
          accent="purple"
        />
        <MetricCard
          label="Total downloads"
          value={totalDownloads}
          icon={Download}
          trend="Mock aggregate from chart data"
          accent="blue"
        />
        <MetricCard
          label="Recent activity"
          value={recentActivityCount}
          icon={Activity}
          trend={`${analytics?.unread_notifications ?? 0} unread notifications`}
          accent="green"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ActivityChart />
        </div>
        <div>
          <RecentActivityFeed
            projects={analytics?.recent_projects ?? []}
            notifications={notifications}
          />
        </div>
      </div>
    </div>
  );
}
