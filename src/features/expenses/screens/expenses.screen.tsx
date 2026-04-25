import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import usePoolExpenses from '@/features/expenses/hooks/use-pool-expenses';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import SkeletonBox from '@/core/common/components/skeleton-box';
import EmptyState from '@/core/common/components/empty-state';
import { Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { Expense } from '@/features/expenses/expenses.interface';
import { ExpenseCard } from '@/features/expenses/components/expense.card';
import { TextStyles } from '@/core/common/constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import usePoolsStore from '@/features/pools/pools.state';

type Props = StaticScreenProps<{ poolId: string }>;

export default function ExpensesScreen({ route }: Props) {
  const { poolId } = route.params;
  const colors = useThemeColors();
  const nav = useNavigation() as any;
  const { selectedPool } = usePoolsStore();
  const [page, setPage] = useState(1);
  const { expenses, pagination, isLoading, refetch } = usePoolExpenses(poolId, { page });

  // accumulate pages
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const seenIdsRef = useRef(new Set<string>());

  useEffect(() => {
    // reset when pool changes
    setAllExpenses([]);
    seenIdsRef.current.clear();
    setPage(1);
  }, [poolId]);

  useEffect(() => {
    if (!expenses.length) return;
    const fresh = expenses.filter((e) => !seenIdsRef.current.has(e.id));
    if (!fresh.length) return;
    fresh.forEach((e) => seenIdsRef.current.add(e.id));
    setAllExpenses((prev) => [...prev, ...fresh]);
  }, [expenses]);

  const hasMore = pagination ? page < pagination.pages : false;
  const isFetchingMore = isLoading && page > 1;

  const loadMore = () => {
    if (!isLoading && hasMore) setPage((p) => p + 1);
  };

  const isInitialLoad = isLoading && page === 1;

  return (
    <ScreenContainer useScrollView={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.surface }]}
            onPress={() => {
              if (nav.canGoBack()) nav.goBack();
            }}
          >
            <FontAwesome6 name="chevron-left" size={16} color={colors.text.primary} />
          </TouchableOpacity>
          <View>
            <Text
              style={[
                TextStyles.bodySmall,
                { color: colors.text.secondary, textTransform: 'uppercase' },
              ]}
            >
              {selectedPool?.name || 'Pool'}
            </Text>
            <Text style={[TextStyles.headingMedium, { color: colors.text.primary }]}>EXPENSES</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => nav.navigate('NewExpense', { poolId })}
          style={[styles.newBtn, { backgroundColor: colors.primary }]}
          accessibilityLabel="Create new group"
        >
          <Ionicons name="add" size={20} color={colors.onPrimary} />
          <Text style={[TextStyles.label, { color: colors.onPrimary }]}>New</Text>
        </TouchableOpacity>
      </View>

      {isInitialLoad ? (
        <View style={styles.skeletonList}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBox key={i} width="100%" height={72} bg={colors.surface} />
          ))}
        </View>
      ) : (
        <FlatList
          data={allExpenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExpenseCard expense={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator size="small" color={colors.primary} style={styles.footerSpinner} />
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              title="No expenses yet"
              subtitle="Log an expense to get started."
              actionLabel="Log expense"
              onAction={() => refetch()}
            />
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
});
