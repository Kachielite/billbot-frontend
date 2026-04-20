import axios from 'axios';
import zustandStorage from '@/core/common/utils/zustandStorage';
import { IAuth } from '@/features/auth/auth.interface';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import ENV from '@/core/common/constants/env';

const BASE_URL = ENV.BASE_URL;

// Token store that reads from storage on every access to stay in sync
const tokenStore = {
  getAccessToken: (): string | null => {
    try {
      const tokenStorage = zustandStorage.getItem('auth-token') as string | null;
      if (tokenStorage) {
        // tokenStorage may be one of:
        // - a JSON string of the form `"my-token"` (auth.state.setToken stored a string)
        // - a JSON object matching Omit<IAuth, 'user'> (tokenStore.setTokens stores this)
        try {
          const parsed = JSON.parse(tokenStorage);

          // If parsed is a plain string ("my-token"), return it
          if (typeof parsed === 'string') return parsed;

          // If parsed is an object, attempt to find token in common shapes
          if (parsed && typeof parsed === 'object') {
            // common shape: { data: { token: string } }
            if (parsed.data && typeof parsed.data.token === 'string') return parsed.data.token;
            // alternate shape: { token: string }
            if (typeof parsed.token === 'string') return parsed.token;
          }
        } catch (err) {
          // If parsing fails, tokenStorage might already be the raw token string
          // but zustandStorage.getItem returns strings, so this is unlikely. Still, handle it.
          return tokenStorage;
        }
      }
      return null;
    } catch (error) {
      console.error(`Error reading access token from storage: ${error}`);
      return null;
    }
  },
  setTokens: (t: Omit<IAuth, 'user'>) => {
    zustandStorage.setItem('auth-token', JSON.stringify(t));
  },
  clearTokens: () => {
    zustandStorage.removeItem('auth-token');
  },
};

// Minimal axios instance — baseURL can be set via environment or elsewhere
const api = axios.create({ baseURL: BASE_URL });

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401: try refresh, retry original request, otherwise logout
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Any 401 should immediately clear tokens and log the user out
      try {
        tokenStore.clearTokens();
      } catch (err) {
        /* ignore */
      }

      try {
        const { clearAuth } = await import('@/features/auth/auth.state').then((m) =>
          m.default.getState(),
        );
        clearAuth();
      } catch (err) {
        // best-effort only
        try {
          console.error(`Failed to clear auth state: ${err}`);
        } catch {}
      }

      return Promise.reject(
        mapAxiosErrorToAppError(new Error('Session expired. Please login again.')),
      );
    }

    return Promise.reject(error);
  },
);

const customAxios = api;

export { customAxios, tokenStore };
