import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import { Spacing } from '@/core/common/constants/theme';
import useGroupPools from '@/features/pools/hooks/use-group-pools';
import SkeletonBox from '@/core/common/components/skeleton-box';
import { TabCard } from '@/features/pools/components/pool.card';
import { useNavigation } from '@react-navigation/native';

export default function GroupTabs({ groupId }: { groupId: string }) {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const { isLoading, pagination, pools } = useGroupPools(groupId);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Tabs</Text>
        {pagination && pagination?.totalItems > 6 ? (
          <TouchableOpacity onPress={() => navigation.navigate('Pools', { groupId })}>
            <Text style={[TextStyles.label, { color: colors.onPrimaryContainer }]}>See All</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={[styles.tabContainer]}>
        {isLoading ? (
          // show a few skeletons while loading first page
          <View>
            {[0, 1, 2].map((i) => (
              <View key={i} style={{ paddingVertical: Spacing.sm }}>
                <SkeletonBox width={'100%'} height={64} bg={colors.surface} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.tabContainer}>
            {pools.slice(0, 6).map((pool, index) => (
              <TabCard pool={pool} key={pool.id} />
            ))}
          </View>
        )}
      </View>
      <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>
        Tabs collect related expenses together. You can have a tab for each trip, event, or category
        of expenses.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.md,
    width: '100%',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: Spacing.sm,
  },
});
