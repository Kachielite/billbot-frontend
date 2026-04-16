import { useColorScheme } from 'react-native';
import { DarkColors, LightColors } from '@/core/common/constants/theme';

const useThemeColors = () => {
  const scheme = useColorScheme();

  if (scheme === 'dark') {
    return DarkColors;
  }

  return LightColors;
};

export default useThemeColors;
