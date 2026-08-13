import type { AuthTokens } from '../types';

const TOKEN_KEY = 'examguard_auth_tokens';

export const tokenStorage = {
  getTokens: (): AuthTokens | null => {
    try {
      const stored = localStorage.getItem(TOKEN_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setTokens: (tokens: AuthTokens): void => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  },

  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getAccessToken: (): string | null => {
    const tokens = tokenStorage.getTokens();
    return tokens?.accessToken || null;
  },

  getRefreshToken: (): string | null => {
    const tokens = tokenStorage.getTokens();
    return tokens?.refreshToken || null;
  }
};
