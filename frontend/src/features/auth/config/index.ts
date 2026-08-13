export interface AuthConfig {
  sessionTimeout: number; // in milliseconds
  idleTimeout: number; // in milliseconds
  tokenRefreshThreshold: number; // Refresh token when it has this many MS remaining
}

export const authConfig: AuthConfig = {
  sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
  idleTimeout: 30 * 60 * 1000, // 30 minutes
  tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
};
