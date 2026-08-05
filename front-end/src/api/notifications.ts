import api from "./axios";
import type { Notification, PaginatedResponse } from "../types";
import { normalizeListResponse } from "../utils/normalizeListResponse";

export async function fetchNotifications(): Promise<Notification[]> {
  const { data } = await api.get<
    Notification[] | PaginatedResponse<Notification>
  >("/notifications/");
  return normalizeListResponse(data);
}

export async function markNotificationRead(id: number): Promise<Notification> {
  const { data } = await api.patch<Notification>(
    `/notifications/${id}/read/`,
  );
  return data;
}

export async function markAllNotificationsRead(
  notifications: Notification[],
): Promise<Notification[]> {
  const unread = notifications.filter((n) => !n.is_read);
  return Promise.all(unread.map((n) => markNotificationRead(n.id)));
}
