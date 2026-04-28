import { Platform } from 'react-native';

const rawBaseUrl = process.env.EXPO_PUBLIC_BACKEND_URL ?? '';

// On Android emulators, `localhost` resolves to the emulator itself.
// The host machine is reachable via the special alias 10.0.2.2.
const resolvedBaseUrl =
  Platform.OS === 'android' ? rawBaseUrl.replace(/localhost/g, '10.0.2.2') : rawBaseUrl;

const ENV = {
  BASE_URL: resolvedBaseUrl,
  STORAGE_KEY: process.env.EXPO_PUBLIC_STORAGE_KEY as string,
  WEB_CLIENT_ID: process.env.EXPO_PUBLIC_WEB_CLIENT_ID as string,
  ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID as string,
  IOS_CLIENT_ID: process.env.EXPO_PUBLIC_IOS_CLIENT_ID as string,
};

export default ENV;
