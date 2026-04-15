import { StyleSheet } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainerStyle } from '@/core/common/constants/theme';

const ScreenContainer = ({ children }: { children: React.ReactNode }) => {
  const colors = useThemeColors();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...ScreenContainerStyle,
  },
});

export default ScreenContainer;
