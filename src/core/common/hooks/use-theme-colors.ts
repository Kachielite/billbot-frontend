import { useColorScheme } from 'react-native';
import { DarkColors, LightColors } from '@/core/common/constants/theme';

const useThemeColors = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? DarkColors : LightColors;
};

export default useThemeColors;
