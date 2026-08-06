import { Bell, Menu, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { getInitials } from "../../utils/format";
import GlobalSearch from "../search/GlobalSearch";

interface TopBarProps {
  unreadCount: number;
  onMenuClick: () => void;
}

export default function TopBar({ unreadCount, onMenuClick }: TopBarProps) {
  const { user } = useAuth();
  const { isDark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-800 bg-surface/95 backdrop-blur-sm">
      <div className="flex h-16 items-center gap-3 px-4 md:gap-6 md:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-lg font-semibold text-white">SkillSphere</span>
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <GlobalSearch />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={toggle}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <Link
            to="/notifications"
            className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
            )}
          </Link>

          <Link
            to="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent"
            aria-label="Profile"
          >
            {user ? getInitials(user.full_name) : "?"}
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-800 px-4 pb-3 md:hidden">
        <GlobalSearch />
      </div>
    </header>
  );
}
