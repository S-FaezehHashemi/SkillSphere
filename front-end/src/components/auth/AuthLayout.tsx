import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  const { isDark } = useTheme();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-surface">
      <Link
        to="/"
        className="mb-8 flex items-center gap-2 text-gray-900 dark:text-white"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        <span className="text-xl font-semibold">SkillSphere</span>
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-surface-card">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        </div>

        {children}

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {footer}
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        {isDark ? "Dark mode" : "Light mode"} · SkillSphere
      </p>
    </div>
  );
}
