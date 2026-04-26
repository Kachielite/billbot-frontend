import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useGroups from '@/features/groups/hooks/use-groups';
import GroupCard from '@/features/groups/components/group-card';
import SkeletonBox from '@/core/common/components/skeleton-box';
import EmptyState from '@/core/common/components/empty-state';
import type { Group } from '@/features/groups/groups.interface';
import useGroupsStore from '@/features/groups/groups.state';

const SKELETON_COUNT = 5;

const GroupsScreen = () => {
  const colors = useThemeColors();
  const nav = useNavigation() as any;

  const { groups, pagination, isLoading, page, setPage, refetch } = useGroups();

  // Accumulate pages for infinite scroll
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const seenIdsRef = useRef(new Set<string>());

  useEffect(() => {
    if (!groups.length) return;
    const fresh = groups.filter((g) => !seenIdsRef.current.has(g.id));
    if (!fresh.length) return;
    fresh.forEach((g) => seenIdsRef.current.add(g.id));
    setAllGroups((prev) => [...prev, ...fresh]);
  }, [groups]);

  const hasMore = pagination ? page < pagination.pages : false;
  const isFetchingMore = isLoading && page > 1;

  const loadMore = () => {
    if (!isLoading && hasMore) setPage((p) => p + 1);
  };

  const isInitialLoad = isLoading && page === 1;

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setAllGroups([]);
    seenIdsRef.current.clear();
    setPage(1);
    await refetch();
    setRefreshing(false);
  }, [refetch, setPage]);

  return (
    <ScreenContainer useScrollView={false}>
      {/* ── Header ───────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={[TextStyles.headingLarge, { color: colors.text.primary }]}>Groups</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => nav.navigate('JoinGroupByCode')}
            style={[
              styles.joinBtn,
              { backgroundColor: colors.surface, borderColor: colors.border.default },
            ]}
            accessibilityLabel="Join a group"
          >
            <Ionicons name="people-outline" size={16} color={colors.text.primary} />
            <Text style={[TextStyles.label, { color: colors.text.primary }]}>Join</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => nav.navigate('NewGroup')}
            style={[styles.newBtn, { backgroundColor: colors.primary }]}
            accessibilityLabel="Create new group"
          >
            <Ionicons name="add" size={20} color={colors.onPrimary} />
            <Text style={[TextStyles.label, { color: colors.onPrimary }]}>New</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── List ─────────────────────────────────────────────────── */}
      {isInitialLoad ? (
        <View style={styles.skeletonList}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <SkeletonBox key={i} width="100%" height={72} bg={colors.surface} />
          ))}
        </View>
      ) : (
        <FlatList
          data={allGroups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GroupCard group={item} />}
          contentContainerStyle={[styles.listContent, { flexGrow: 1 }]}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator size="small" color={colors.primary} style={styles.footerSpinner} />
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              title="No groups yet"
              subtitle="Create your first group to start splitting expenses with friends and family."
              actionLabel="Create group"
              onAction={() => nav.navigate('NewGroup')}
            />
          }
        />
      )}
    </ScreenContainer>
  );
};

export default GroupsScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: Border.thin,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    ...Shadow.sm,
  },
  skeletonList: {
    gap: Spacing.sm,
  },
  listContent: {
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  footerSpinner: {
    paddingVertical: Spacing.md,
  },
});
