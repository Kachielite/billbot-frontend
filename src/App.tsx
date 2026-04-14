import { useColorScheme } from 'react-native';

import { QueryClient, QueryClientProvider } from 'react-query';
import useLoadFonts from '@/core/common/hooks/use-load-fonts';
import * as SplashScreen from 'expo-splash-screen';
import { Navigation } from '@/core/navigation';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

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
  const currentTheme = isDarkMode ? DarkTheme : DefaultTheme;
  return (
    <QueryClientProvider client={queryClient}>
      <Navigation theme={currentTheme} />
    </QueryClientProvider>
  );
}
