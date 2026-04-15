import { StyleSheet, Pressable } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import ScreenHeader from '@/core/common/components/screen-header';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/core/common/components/layout/screen-container';

const HomeScreen = () => {
  const colors = useThemeColors();
  return (
    <ScreenContainer>
      <ScreenHeader title="Good morning 👋">
        <Pressable>
          <Ionicons name="notifications" size={24} color={colors.text.primary} />
        </Pressable>
      </ScreenHeader>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({});

export default HomeScreen;
