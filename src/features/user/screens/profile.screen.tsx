import { StyleSheet, Text } from 'react-native';
import React from 'react';
import CustomButton from '@/core/common/components/form/custom-button';
import useAuthStore from '@/features/auth/auth.state';
import ScreenContainer from '@/core/common/components/layout/screen-container';

const ProfileScreen = () => {
  const { clearAuth } = useAuthStore();
  return (
    <ScreenContainer>
      <Text>ProfileScreen</Text>
      <CustomButton label="Logout" onPress={clearAuth} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({});

export default ProfileScreen;
