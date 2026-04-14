import { Text, ScrollView } from 'react-native';
import React from 'react';
import { Button } from '@react-navigation/elements';
import useAuthStore from '@/features/auth/auth.state';

const HomeScreen = () => {
  const { clearAuth } = useAuthStore();
  return (
    <ScrollView
      contentInsetAdjustmentBehavior={'automatic'}
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
    >
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
    </ScrollView>
  );
};
export default HomeScreen;
