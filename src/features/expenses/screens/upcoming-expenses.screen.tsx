import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import { TextStyles } from '@/core/common/constants/fonts';
import { Border, Radius, Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import moment from 'moment';
import useUpcomingExpenses from '@/features/expenses/hooks/use-upcoming-expenses';
import UpcomingCard from '@/features/expenses/components/upcoming-card';
import EmptyState from '@/core/common/components/empty-state';
import SkeletonBox from '@/core/common/components/skeleton-box';
import { UpcomingExpense } from '@/features/expenses/expenses.interface';

// ── Date grouping (forward-looking) ──────────────────────────────────────────

type Section = { title: string; data: UpcomingExpense[] };

const groupByDue = (items: UpcomingExpense[]): Section[] => {
  const todayStart = moment().startOf('day');
  const tomorrowStart = moment().add(1, 'day').startOf('day');
  const weekEnd = moment().add(7, 'days').startOf('day');

  const buckets: Record<string, UpcomingExpense[]> = {
    Today: [],
    Tomorrow: [],
    'This Week': [],
    Later: [],
  };

  for (const item of items) {
    const d = moment(item.nextOccurrenceAt).startOf('day');
    if (d.isSame(todayStart)) buckets['Today'].push(item);
    else if (d.isSame(tomorrowStart)) buckets['Tomorrow'].push(item);
    else if (d.isBefore(weekEnd)) buckets['This Week'].push(item);
    else buckets['Later'].push(item);
  }

  return Object.entries(buckets)
    .filter(([, data]) => data.length > 0)
    .map(([title, data]) => ({ title, data }));
};

// ── Screen ────────────────────────────────────────────────────────────────────

export default function UpcomingExpensesScreen() {
  const colors = useThemeColors();
  const { canGoBack, goBack } = useNavigation();

  const { allItems, isLoading, isFetching, hasMore, loadMore, refetch } = useUpcomingExpenses(20);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const sections = React.useMemo(() => groupByDue(allItems), [allItems]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
    if (distanceFromBottom < 200 && hasMore && !isFetching) {
      loadMore();
    }
  };

  return (
    <ScreenContainer useScrollView={false}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
          onPress={() => canGoBack() && goBack()}
        >
          <FontAwesome6 name="chevron-left" size={16} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[TextStyles.headingMedium, { color: colors.text.primary }]}>Upcoming</Text>
        <View style={{ width: 45 }} />
      </View>

      {/* ── Content ── */}
      {isLoading ? (
        <View style={{ gap: Spacing.md, paddingTop: Spacing.md }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBox
              key={i}
              width="100%"
              height={68}
              bg={colors.surface}
              style={{ borderRadius: Radius.lg }}
            />
          ))}
        </View>
      ) : sections.length === 0 ? (
        <View style={{ flex: 1 }}>
          <EmptyState
            title="No upcoming expenses"
            subtitle="You have no upcoming recurring expenses."
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? Spacing.xxl : 100,
            gap: Spacing.xl,
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
          {sections.map(({ title, data }) => (
            <View key={title} style={styles.section}>
              <Text style={[TextStyles.label, { color: colors.text.disabled }]}>
                {title.toUpperCase()}
              </Text>
              <View
                style={[
                  styles.groupCard,
                  { backgroundColor: colors.surface, borderColor: colors.border.default },
                ]}
              >
                {data.map((item, index) => (
                  <UpcomingCard key={item.id} upcoming={item} isLast={index === data.length - 1} />
                ))}
              </View>
            </View>
          ))}

          {isFetching && (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          )}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: Spacing.sm,
  },
  groupCard: {
    borderRadius: Radius.lg,
    borderWidth: Border.thin,
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
});
