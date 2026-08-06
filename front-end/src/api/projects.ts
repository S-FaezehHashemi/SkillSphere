import api from "./axios";
import type { PaginatedResponse, Project } from "../types";

export interface CreateProjectPayload {
  title: string;
  description?: string;
  tags?: string;
  file?: File | null;
}

export async function fetchProjects(page = 1) {
  const { data } = await api.get<PaginatedResponse<Project>>("/projects/", {
    params: { page },
  });
  return data;
}

export async function fetchMyProjects(page = 1) {
  const { data } = await api.get<PaginatedResponse<Project>>(
    "/projects/mine/",
    { params: { page } },
  );
  return data;
}

export async function fetchProject(id: number) {
  const { data } = await api.get<Project>(`/projects/${id}/`);
  return data;
}

export async function createProject(payload: CreateProjectPayload) {
  const formData = new FormData();
  formData.append("title", payload.title.trim());
  formData.append("description", payload.description?.trim() ?? "");
  if (payload.tags?.trim()) {
    formData.append("tags", payload.tags.trim());
  }
  if (payload.file) {
    formData.append("file_path", payload.file);
  }

  const { data } = await api.post<Project>("/projects/", formData);
  return data;
}

export async function deleteProject(id: number) {
  await api.delete(`/projects/${id}/`);
}
