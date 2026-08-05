export const NOTIFICATIONS_UPDATED = "skillsphere:notifications-updated";

export function dispatchNotificationsUpdated() {
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED));
}
