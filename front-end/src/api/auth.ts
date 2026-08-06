import api from "./axios";
import type { LoginResponse, RegisterPayload } from "../types";

export async function loginRequest(email: string, password: string) {
  const { data } = await api.post<LoginResponse>("/auth/login/", {
    email,
    password,
  });
  return data;
}

export async function registerRequest(payload: RegisterPayload) {
  const { data } = await api.post<{ detail: string; user_id: number }>(
    "/auth/register/",
    payload,
  );
  return data;
}
