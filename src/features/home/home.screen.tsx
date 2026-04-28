import React from 'react';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import HomeHeader from '@/features/home/components/home-header';
import HomeBalances from '@/features/home/components/home.balances';
import HomeGroups from '@/features/home/components/home.groups';
import HomeUpcoming from '@/features/home/components/home.upcoming';
import HomeActivities from '@/features/home/components/home.activities';
import { Platform, RefreshControl, ScrollView } from 'react-native';
import { Spacing } from '@/core/common/constants/theme';
import HomeQuickActions from '@/features/home/components/home.quick-actions';
import { useQueryClient } from 'react-query';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import useThemeColors from '@/core/common/hooks/use-theme-colors';

const HomeScreen = () => {
  const queryClient = useQueryClient();
  const colors = useThemeColors();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries([QUERY_KEYS.USER_BALANCES]),
      queryClient.invalidateQueries([QUERY_KEYS.GROUPS]),
      queryClient.invalidateQueries([QUERY_KEYS.UPCOMING_EXPENSES]),
      queryClient.invalidateQueries([QUERY_KEYS.USER_ACTIVITIES]),
    ]);
    setRefreshing(false);
  }, [queryClient]);

  return (
    <ScreenContainer useScrollView={false}>
      <HomeHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? Spacing.xxl : 100,
          gap: 16,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
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
