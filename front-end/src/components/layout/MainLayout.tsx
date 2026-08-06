import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { fetchNotifications } from "../../api/notifications";
import { SearchProvider } from "../../contexts/SearchContext";
import { NOTIFICATIONS_UPDATED } from "../../utils/notificationEvents";
import SimulatedSessionBanner from "../auth/SimulatedSessionBanner";
import MobileMenu from "./MobileMenu";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const items = await fetchNotifications();
      setUnreadCount(items.filter((n) => !n.is_read).length);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  useEffect(() => {
    window.addEventListener(NOTIFICATIONS_UPDATED, refreshUnreadCount);
    return () =>
      window.removeEventListener(NOTIFICATIONS_UPDATED, refreshUnreadCount);
  }, [refreshUnreadCount]);

  return (
    <SearchProvider>
      <div className="flex min-h-screen bg-surface">
        <div className="hidden lg:flex">
          <Sidebar unreadCount={unreadCount} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            unreadCount={unreadCount}
            onMenuClick={() => setMobileOpen(true)}
          />
          <MobileMenu
            open={mobileOpen}
            unreadCount={unreadCount}
            onClose={() => setMobileOpen(false)}
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <SimulatedSessionBanner />
            <Outlet />
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
