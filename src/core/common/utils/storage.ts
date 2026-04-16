import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();

export async function saveItem(key: string, value: unknown): Promise<void> {
  storage.set(key, JSON.stringify(value));
}

export async function getItem<T>(key: string): Promise<T | null> {
  const raw = storage.getString(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function removeItem(key: string): Promise<void> {
  storage.remove(key);
}

export async function clearAll(): Promise<void> {
  storage.clearAll();
}
