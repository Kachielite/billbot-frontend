import { FlatList, View } from 'react-native';
import React from 'react';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import useGroupPools from '@/features/pools/hooks/use-group-pools';
import { StaticScreenProps } from '@react-navigation/native';
import PoolsHeader from '@/features/pools/components/pools.header';
import useGroupDetail from '@/features/groups/hooks/use-group-detail';
import SkeletonBox from '@/core/common/components/skeleton-box';
import { TabCard } from '@/features/pools/components/pool.card';
import { Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';

type Props = StaticScreenProps<{ groupId: string }>;

export default function PoolsScreen({ route }: Props) {
  const { groupId } = route.params;
  const colors = useThemeColors();

  // rename to avoid collision
  const { group, isLoading: groupLoading } = useGroupDetail(groupId);

  const {
    isLoading: poolsLoading,
    pools = [],
    page,
    setPage,
    pagination,
    isFetching,
    refetch,
  } = useGroupPools(groupId);

  const data = pools || [];

  function loadMore() {
    if (isFetching) return;
    if (pagination && page < (pagination.pages ?? 0)) {
      setPage(page + 1);
    }
  }

  return (
    <ScreenContainer useScrollView={false}>
      <PoolsHeader
        totalPools={pagination?.totalItems || 0}
        groupName={group?.name as string}
        groupId={groupId}
      />
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <View
            style={{
              paddingBottom: Spacing.sm,
              marginBottom: Spacing.sm,
            }}
          >
            <TabCard pool={item} />
          </View>
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
        refreshing={poolsLoading || groupLoading}
        onRefresh={async () => {
          // reset to first page and refetch
          setPage(1);
          if (typeof refetch === 'function') await refetch();
        }}
      />
    </ScreenContainer>
  );
}

// no local styles required
