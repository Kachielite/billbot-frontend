import { FlatList, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import { Pool } from '@/features/pools/pools.interface';
import { Card, Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import getInitials from '@/core/common/utils/get-initials';
import useGroupPools from '@/features/pools/hooks/use-group-pools';
import SkeletonBox from '@/core/common/components/skeleton-box';

export const TabCard = ({ pool, isLast = false }: { pool: Pool; isLast?: boolean }) => {
  const colors = useThemeColors();
  const amountColor =
    pool.balance?.netBalance && pool.balance.netBalance < 0 ? colors.error : colors.primary;
  let activityStatus = '';
  switch (pool.activityStatus) {
    case 'empty':
      activityStatus = 'No activity';
      break;
    case 'ongoing':
      activityStatus = 'Ongoing';
      break;
    case 'settled':
      activityStatus = 'Settled';
      break;
    default:
      activityStatus = '';
  }

  return (
    <TouchableOpacity
      style={[
        poolCardStyles.poolCard,
        {
          padding: Spacing.md,
          borderBottomColor: colors.border.subtle,
          borderBottomWidth: isLast ? 0 : 1,
        },
      ]}
    >
      <View style={[poolCardStyles.emojiContainer, { backgroundColor: colors.primaryContainer }]}>
        <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>
          {getInitials(pool.name)}
        </Text>
      </View>
      <View style={poolCardStyles.contentRow}>
        <View style={poolCardStyles.leftColumn}>
          <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>{pool.name}</Text>
          <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>
            {pool.expenseCount} expenses
          </Text>
        </View>
        <View style={poolCardStyles.rightColumn}>
          <View style={poolCardStyles.rightTopRow}>
            <Text style={[TextStyles.amountSmall, { color: amountColor }]}>
              {pool.balance?.currency}
            </Text>
            <Text style={[TextStyles.amountSmall, { color: amountColor }]}>
              {pool.balance?.netBalance}
            </Text>
          </View>
          <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>
            {activityStatus}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const poolCardStyles = StyleSheet.create({
  poolCard: {
    borderRadius: Radius.lg,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    width: '100%',
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightTopRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.xs,
  },
});

export default function GroupTabs({ groupId }: { groupId: string }) {
  const colors = useThemeColors();
  const { isLoading, isFetching, pools, pagination, page, setPage } = useGroupPools(groupId);

  const loadMore = () => {
    if (!pagination) return;
    if (page >= pagination.pages) return;
    // request next page
    setPage(page + 1);
  };

  const [data, setData] = React.useState<Pool[]>([]);

  // accumulate pages into a single list for infinite scroll
  React.useEffect(() => {
    if (!pools) return;
    if (page === 1) {
      setData(pools);
    } else {
      setData((prev) => [...prev, ...pools]);
    }
  }, [pools, page]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Tabs</Text>
        {pagination && pagination?.totalItems > 8 ? (
          <Text style={[{ color: colors.onPrimaryContainer }]}>See All</Text>
        ) : null}
      </View>

      <View
        style={[
          styles.tabContainer,
          { backgroundColor: colors.surface, borderColor: colors.border.default },
        ]}
      >
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
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <TabCard pool={item} key={item.id} isLast={index === data.length - 1} />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled
            onEndReachedThreshold={0.6}
            onEndReached={loadMore}
            ListFooterComponent={() =>
              isFetching && page > 1 ? (
                <View style={{ paddingVertical: Spacing.sm }}>
                  <SkeletonBox width={'100%'} height={64} bg={colors.surface} />
                </View>
              ) : null
            }
            refreshing={isLoading}
            onRefresh={() => {
              setPage(1);
            }}
          />
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
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
  },
});
