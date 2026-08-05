export type NotificationCategory =
  | "system_success"
  | "system_error"
  | "project_approval"
  | "comment"
  | "invitation"
  | "general";

export interface CategoryMeta {
  label: string;
  description: string;
}

export const CATEGORY_META: Record<NotificationCategory, CategoryMeta> = {
  system_success: {
    label: "Success",
    description: "System success alerts",
  },
  system_error: {
    label: "Error",
    description: "System error alerts",
  },
  project_approval: {
    label: "Approval",
    description: "Project approval updates",
  },
  comment: {
    label: "Comment",
    description: "Comments on your projects",
  },
  invitation: {
    label: "Invitation",
    description: "Project invitations",
  },
  general: {
    label: "General",
    description: "Other notifications",
  },
};

export function categorizeNotification(message: string): NotificationCategory {
  const lower = message.toLowerCase();

  if (
    lower.includes("error") ||
    lower.includes("failed") ||
    lower.includes("unsuccessful") ||
    lower.includes("could not")
  ) {
    return "system_error";
  }

  if (lower.includes("invit")) {
    return "invitation";
  }

  if (lower.includes("comment")) {
    return "comment";
  }

  if (lower.includes("approv")) {
    return "project_approval";
  }

  if (
    lower.includes("success") ||
    lower.includes("welcome") ||
    lower.includes("uploaded") ||
    lower.includes("created")
  ) {
    return "system_success";
  }

  return "general";
}
