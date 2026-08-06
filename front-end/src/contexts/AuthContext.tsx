import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loginRequest, registerRequest } from "../api/auth";
import api from "../api/axios";
import type { RegisterPayload, User } from "../types";
import { simulateGoogleAuth } from "../utils/googleAuth";
import { logActivity } from "../utils/activityLog";
import { sessionFlags } from "../utils/sessionFlags";
import { tokenStorage } from "../utils/tokenStorage";

const SIMULATED_USER: User = {
  id: 0,
  email: "google.user@gmail.com",
  full_name: "Google User",
  created_at: new Date().toISOString(),
};

export interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSimulatedSession: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  fetchMe: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    tokenStorage.getAccess(),
  );
  const [isSimulatedSession, setIsSimulatedSession] = useState(() =>
    sessionFlags.isSimulated(),
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get<User>("/auth/me/");
      setUser(data);
      setIsSimulatedSession(false);
      sessionFlags.setSimulated(false);
    } catch {
      setUser(null);
      setAccessToken(null);
      setIsSimulatedSession(false);
      sessionFlags.setSimulated(false);
      tokenStorage.clear();
    }
  }, []);

  useEffect(() => {
    async function bootstrap() {
      if (sessionFlags.isSimulated() && tokenStorage.hasTokens()) {
        setAccessToken(tokenStorage.getAccess());
        setUser(SIMULATED_USER);
        setIsSimulatedSession(true);
      } else if (tokenStorage.hasTokens()) {
        await fetchMe();
      }
      setIsLoading(false);
    }

    bootstrap();
  }, [fetchMe]);

  const persistSession = useCallback(
    async (access: string, refresh: string) => {
      sessionFlags.setSimulated(false);
      tokenStorage.setTokens(access, refresh);
      setAccessToken(access);
      setIsSimulatedSession(false);
      await fetchMe();
    },
    [fetchMe],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await loginRequest(email, password);
      await persistSession(data.access, data.refresh);
      logActivity({
        type: "login",
        message: `Signed in as ${email}`,
      });
    },
    [persistSession],
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    await registerRequest(payload);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const data = await simulateGoogleAuth();
    tokenStorage.setTokens(data.access, data.refresh);
    sessionFlags.setSimulated(true);
    setAccessToken(data.access);
    setUser(data.user);
    setIsSimulatedSession(true);
    logActivity({
      type: "login",
      message: "Signed in with Google (simulated)",
    });
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    sessionFlags.setSimulated(false);
    setUser(null);
    setAccessToken(null);
    setIsSimulatedSession(false);
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isSimulatedSession) return true;

    const refresh = tokenStorage.getRefresh();
    if (!refresh) {
      logout();
      return false;
    }

    try {
      const { data } = await api.post<{ access: string }>(
        "/auth/token/refresh/",
        { refresh },
      );
      tokenStorage.setTokens(data.access, refresh);
      setAccessToken(data.access);
      return true;
    } catch {
      logout();
      return false;
    }
  }, [isSimulatedSession, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken && user),
      isLoading,
      isSimulatedSession,
      login,
      register,
      loginWithGoogle,
      logout,
      refreshToken,
      fetchMe,
    }),
    [
      user,
      accessToken,
      isLoading,
      isSimulatedSession,
      login,
      register,
      loginWithGoogle,
      logout,
      refreshToken,
      fetchMe,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
