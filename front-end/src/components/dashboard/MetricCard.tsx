import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  accent?: "purple" | "blue" | "green";
}

const accentStyles = {
  purple: "bg-accent/20 text-accent",
  blue: "bg-blue-500/20 text-blue-400",
  green: "bg-green-500/20 text-green-400",
};

export default function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "purple",
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-surface-card p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-gray-500">{trend}</p>
          )}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accentStyles[accent]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
