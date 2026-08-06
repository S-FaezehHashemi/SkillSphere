import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "../../hooks/useTheme";
import { mockActivityOverTime } from "../../utils/mockActivityData";

export default function ActivityChart() {
  const { isDark } = useTheme();

  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const axisColor = isDark ? "#9ca3af" : "#6b7280";
  const tooltipBg = isDark ? "#1E1E1E" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";

  return (
    <div className="rounded-xl border border-gray-800 bg-surface-card p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Activity over time</h2>
        <p className="mt-1 text-sm text-gray-400">
          Uploads, downloads, and logins — mock data
        </p>
      </div>

      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={mockActivityOverTime}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="date"
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "8px",
                color: isDark ? "#f3f4f6" : "#111827",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "13px", color: axisColor }}
            />
            <Line
              type="monotone"
              dataKey="uploads"
              name="Uploads"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ r: 3, fill: "#8B5CF6" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="downloads"
              name="Downloads"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 3, fill: "#3B82F6" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="logins"
              name="Logins"
              stroke="#22C55E"
              strokeWidth={2}
              dot={{ r: 3, fill: "#22C55E" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
