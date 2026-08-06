import type { User } from "../types";

export interface SimulatedGoogleAuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export function simulateGoogleAuth(): Promise<SimulatedGoogleAuthResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        access: `google_sim_access_${crypto.randomUUID()}`,
        refresh: `google_sim_refresh_${crypto.randomUUID()}`,
        user: {
          id: 0,
          email: "google.user@gmail.com",
          full_name: "Google User",
          created_at: new Date().toISOString(),
        },
      });
    }, 900);
  });
}
