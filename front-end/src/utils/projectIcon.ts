import {
  Brain,
  Code2,
  Database,
  FileCode2,
  type LucideIcon,
} from "lucide-react";

const TAG_ICONS: Record<string, LucideIcon> = {
  python: Code2,
  django: Database,
  react: FileCode2,
  ml: Brain,
  api: Code2,
};

export function getProjectIcon(tags: string[]): LucideIcon {
  for (const tag of tags) {
    const icon = TAG_ICONS[tag.toLowerCase()];
    if (icon) return icon;
  }
  return Code2;
}

export function getProjectIconColor(tags: string[]): string {
  const tag = tags[0]?.toLowerCase() ?? "";
  const colors: Record<string, string> = {
    python: "bg-yellow-500/20 text-yellow-400",
    django: "bg-green-500/20 text-green-400",
    react: "bg-blue-500/20 text-blue-400",
    ml: "bg-purple-500/20 text-purple-400",
    api: "bg-orange-500/20 text-orange-400",
  };
  return colors[tag] ?? "bg-accent/20 text-accent";
}
