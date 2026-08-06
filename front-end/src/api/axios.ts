import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { sessionFlags } from "../utils/sessionFlags";
import { tokenStorage } from "../utils/tokenStorage";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "/api" : "http://127.0.0.1:8000/api");

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
}

function clearAuthAndRedirect() {
  if (sessionFlags.isSimulated()) return;
  tokenStorage.clear();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;

    if (!original || error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (sessionFlags.isSimulated()) {
      return Promise.reject(error);
    }

    if (original.url?.includes("/auth/token/refresh/")) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    const refresh = tokenStorage.getRefresh();
    if (!refresh) {
      isRefreshing = false;
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post<{ access: string }>(
        `${API_BASE_URL}/auth/token/refresh/`,
        { refresh },
      );
      tokenStorage.setTokens(data.access, refresh);
      processQueue(null, data.access);
      original.headers.Authorization = `Bearer ${data.access}`;
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAuthAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
