import type { Project } from "../types";

export function filterProjects(
  projects: Project[],
  query: string,
  tag: string | null,
): Project[] {
  const normalizedQuery = query.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesTag =
      !tag || project.tag_list.some((t) => t.toLowerCase() === tag.toLowerCase());

    if (!normalizedQuery) return matchesTag;

    const haystack = [
      project.title,
      project.description,
      project.tags,
      project.owner.full_name,
      project.owner.email,
      ...project.tag_list,
    ]
      .join(" ")
      .toLowerCase();

    return matchesTag && haystack.includes(normalizedQuery);
  });
}

export function extractUniqueTags(projects: Project[]): string[] {
  const tags = new Set<string>();
  projects.forEach((project) => {
    project.tag_list.forEach((tag) => tags.add(tag.toLowerCase()));
  });
  return Array.from(tags).sort();
}
