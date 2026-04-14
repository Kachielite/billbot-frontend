import axios from 'axios';
import zustandStorage from '@/core/common/utils/zustandStorage';
import { IAuth } from '@/features/auth/auth.interface';
import { mapAxiosErrorToAppError } from '@/core/common/error';

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

// Token store that reads from storage on every access to stay in sync
const tokenStore = {
  getAccessToken: (): string | null => {
    try {
      const tokenStorage = zustandStorage.getItem('auth-token') as string | null;
      if (tokenStorage) {
        const tokens: Omit<IAuth, 'user'> = JSON.parse(tokenStorage);
        return tokens?.data.token || null;
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
// Plain axios instance without interceptors for auth refresh calls (breaks require cycle)
const plainAxios = axios.create({ baseURL: BASE_URL });

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string | PromiseLike<string>) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token as string);
  });
  failedQueue = [];
};

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

      try {
        const navigation = await import('@react-navigation/native').then((m) => m.useNavigation());
        navigation.navigate('Authentication');
      } catch {}

      return Promise.reject(
        mapAxiosErrorToAppError(new Error('Session expired. Please login again.')),
      );
    }

    return Promise.reject(error);
  },
);

const customAxios = api;

export { customAxios, tokenStore };
