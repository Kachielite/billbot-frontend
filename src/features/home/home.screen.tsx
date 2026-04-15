import { Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { Button } from '@react-navigation/elements';
import useAuthStore from '@/features/auth/auth.state';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainer } from '@/core/common/constants/theme';

const HomeScreen = () => {
  const { clearAuth } = useAuthStore();
  const colors = useThemeColors();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text>HomeScreen</Text>
      <Button
        variant="filled"
        onPressIn={() => {
          clearAuth();
          // Navigation happens automatically via conditional rendering when auth state updates
        }}
      >
        Logout
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...ScreenContainer,
  },
});

export default HomeScreen;
