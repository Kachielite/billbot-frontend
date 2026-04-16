const ENV = {
  BASE_URL: process.env.EXPO_PUBLIC_BACKEND_URL as string,
  STORAGE_KEY: process.env.EXPO_PUBLIC_STORAGE_KEY as string,
  ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID as string,
  IOS_CLIENT_ID: process.env.EXPO_PUBLIC_IOS_CLIENT_ID as string,
};

export default ENV;
