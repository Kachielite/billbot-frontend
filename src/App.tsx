import { Platform, useColorScheme } from 'react-native';

import { QueryClient, QueryClientProvider } from 'react-query';
import useLoadFonts from '@/core/common/hooks/use-load-fonts';
import * as SplashScreen from 'expo-splash-screen';
import { Navigation } from '@/core/navigation';
import {
  DarkTheme,
  DefaultTheme,
  MaterialDarkTheme,
  MaterialLightTheme,
} from '@react-navigation/native';
import ToastProvider from 'toastify-react-native';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  useLoadFonts();
  const theme = useColorScheme();
  const isDarkMode = theme === 'dark';
  const currentTheme = Platform.select({
    ios: isDarkMode ? DarkTheme : DefaultTheme,
    android: isDarkMode ? MaterialDarkTheme : MaterialLightTheme,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation theme={currentTheme} />
      <ToastProvider />
    </QueryClientProvider>
  );
}
