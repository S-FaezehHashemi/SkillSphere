import api from "./axios";
import type { DashboardAnalytics } from "../types";

export async function fetchDashboardAnalytics() {
  const { data } = await api.get<DashboardAnalytics>("/analytics/dashboard/");
  return data;
}
