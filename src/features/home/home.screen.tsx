import { StyleSheet, Pressable } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import ScreenHeader from '@/core/common/components/screen-header';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import HomeHeader from '@/features/home/components/home-header';
import HomeBalances from '@/features/home/components/home.balances';
import HomeGroups from '@/features/home/components/home.groups';
import HomeUpcoming from '@/features/home/components/home.upcoming';

const HomeScreen = () => {
  const colors = useThemeColors();
  return (
    <ScreenContainer>
      <HomeHeader />
      <HomeBalances />
      <HomeGroups />
      <HomeUpcoming />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({});

export default HomeScreen;
