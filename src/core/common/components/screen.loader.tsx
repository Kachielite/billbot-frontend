import { ActivityIndicator, View } from 'react-native';
import React from 'react';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import useThemeColors from '@/core/common/hooks/use-theme-colors';

export default function ScreenLoader() {
  const colors = useThemeColors();
  return (
    <ScreenContainer>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color={colors.text.primary} />
      </View>
    </ScreenContainer>
  );
}
