import React from 'react';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import HomeHeader from '@/features/home/components/home-header';
import HomeBalances from '@/features/home/components/home.balances';
import HomeGroups from '@/features/home/components/home.groups';
import HomeUpcoming from '@/features/home/components/home.upcoming';
import HomeActivities from '@/features/home/components/home.activities';
import { Platform, ScrollView } from 'react-native';
import { Spacing } from '@/core/common/constants/theme';
import HomeQuickActions from '@/features/home/components/home.quick-actions';

const HomeScreen = () => {
  return (
    <ScreenContainer useScrollView={false}>
      <HomeHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? Spacing.xxl : 100,
          gap: 16,
        }}
      >
        <HomeBalances />
        <HomeQuickActions />
        <HomeGroups />
        <HomeUpcoming />
        <HomeActivities />
      </ScrollView>
    </ScreenContainer>
  );
};

export default HomeScreen;
