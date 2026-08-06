import {
  Bell,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  unreadCount: number;
  onNavigate?: () => void;
  className?: string;
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    isActive
      ? "border-l-2 border-accent bg-accent/10 text-white"
      : "border-l-2 border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200",
  ].join(" ");

export default function Sidebar({
  unreadCount,
  onNavigate,
  className = "",
}: SidebarProps) {
  const { logout } = useAuth();

  return (
    <aside
      className={`flex h-full w-64 shrink-0 flex-col border-r border-gray-800 bg-surface-card ${className}`}
    >
      <nav className="flex flex-1 flex-col gap-6 p-4">
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Main
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink to="/" end className={linkClass} onClick={onNavigate}>
                <FolderKanban className="h-4 w-4 shrink-0" />
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard"
                className={linkClass}
                onClick={onNavigate}
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/notifications"
                className={linkClass}
                onClick={onNavigate}
              >
                <Bell className="h-4 w-4 shrink-0" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Account
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink to="/profile" className={linkClass} onClick={onNavigate}>
                <User className="h-4 w-4 shrink-0" />
                Profile
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <div className="border-t border-gray-800 p-4">
        <button
          type="button"
          onClick={() => {
            logout();
            onNavigate?.();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-gray-600 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
