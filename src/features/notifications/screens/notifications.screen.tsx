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
import moment from 'moment';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import { TextStyles } from '@/core/common/constants/fonts';
import { Border, Radius, Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '@/core/common/components/empty-state';
import SkeletonBox from '@/core/common/components/skeleton-box';
import useNotifications from '../hooks/use-notifications';
import useMarkRead from '../hooks/use-mark-read';
import useMarkAllRead from '../hooks/use-mark-all-read';
import NotificationCard from '../components/notification-card';
import { Notification } from '../notifications.interface';

// ── Date grouping ─────────────────────────────────────────────────────────────

type Section = { title: string; data: Notification[] };

const groupByDate = (items: Notification[]): Section[] => {
  const todayStart = moment().startOf('day');
  const yesterdayStart = moment().subtract(1, 'day').startOf('day');
  const weekStart = moment().startOf('isoWeek');
  const monthStart = moment().startOf('month');

  const buckets: Record<string, Notification[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    'This Month': [],
    Earlier: [],
  };

  for (const item of items) {
    const d = moment(item.createdAt);
    if (d.isSameOrAfter(todayStart)) buckets['Today'].push(item);
    else if (d.isSameOrAfter(yesterdayStart)) buckets['Yesterday'].push(item);
    else if (d.isSameOrAfter(weekStart)) buckets['This Week'].push(item);
    else if (d.isSameOrAfter(monthStart)) buckets['This Month'].push(item);
    else buckets['Earlier'].push(item);
  }

  return Object.entries(buckets)
    .filter(([, data]) => data.length > 0)
    .map(([title, data]) => ({ title, data }));
};

// ── Screen ────────────────────────────────────────────────────────────────────

function resolveNavigation(
  notification: Notification,
): { screen: string; params: Record<string, string> } | null {
  const meta = notification.metadata as Record<string, any>;

  // action field takes priority — backend explicitly signals the intent
  if (meta.action === 'confirm_settlement' || meta.action === 'view_dispute') {
    if (meta.settlement_id && meta.pool_id)
      return {
        screen: 'Settlement',
        params: { settlementId: meta.settlement_id, poolId: meta.pool_id },
      };
  }

  switch (notification.type) {
    case 'expense.created':
    case 'upcoming.expense':
      if (meta.expense_id && meta.pool_id)
        return { screen: 'Expense', params: { expenseId: meta.expense_id, poolId: meta.pool_id } };
      break;
    case 'settlement.submitted':
    case 'settlement.confirmed':
    case 'settlement.disputed':
      if (meta.settlement_id && meta.pool_id)
        return {
          screen: 'Settlement',
          params: { settlementId: meta.settlement_id, poolId: meta.pool_id },
        };
      break;
    case 'pool.created':
    case 'pool.settled':
      if (meta.pool_id) return { screen: 'Pool', params: { poolId: meta.pool_id } };
      break;
    case 'invite.received':
      if (meta.invite_token && meta.group_id)
        return {
          screen: 'JoinGroupByToken',
          params: { token: meta.invite_token, groupId: meta.group_id },
        };
      break;
    case 'member.joined':
    case 'member.removed':
      if (meta.group_id) return { screen: 'Group', params: { groupId: meta.group_id } };
      break;
  }
  return null;
}

export default function NotificationsScreen() {
  const colors = useThemeColors();
  const nav = useNavigation() as any;
  const { canGoBack, goBack } = useNavigation();

  const { allItems, unreadCount, isLoading, isFetching, hasMore, loadMore, refetch } =
    useNotifications(20);
  const { markRead } = useMarkRead();
  const { markAllRead, isMarking } = useMarkAllRead();

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const sections = React.useMemo(() => groupByDate(allItems), [allItems]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
    if (distanceFromBottom < 200 && hasMore && !isFetching) loadMore();
  };

  const handleMarkAll = async () => {
    await markAllRead();
    await refetch();
  };

  const handlePressNotification = async (notification: Notification) => {
    if (!notification.isRead) await markRead(notification.id);
    const destination = resolveNavigation(notification);
    if (destination) nav.navigate(destination.screen, destination.params);
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

        <Text style={[TextStyles.headingMedium, { color: colors.text.primary }]}>
          Notifications
        </Text>

        {unreadCount > 0 ? (
          <TouchableOpacity
            style={[styles.markAllBtn, { backgroundColor: colors.surface }]}
            onPress={handleMarkAll}
            disabled={isMarking}
          >
            {isMarking ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="checkmark-done-outline" size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* ── Content ── */}
      {isLoading ? (
        <View style={{ gap: Spacing.md, paddingTop: Spacing.md }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBox
              key={i}
              width="100%"
              height={72}
              bg={colors.surface}
              style={{ borderRadius: Radius.lg }}
            />
          ))}
        </View>
      ) : sections.length === 0 ? (
        <View style={{ flex: 1 }}>
          <EmptyState
            title="You're all caught up! 🎉"
            subtitle="No notifications yet. We'll let you know when something happens."
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
                  styles.card,
                  { backgroundColor: colors.surface, borderColor: colors.border.default },
                ]}
              >
                {data.map((notification, index) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    isLast={index === data.length - 1}
                    onPress={() => handlePressNotification(notification)}
                    onAcceptInvite={
                      notification.type === 'invite.received'
                        ? () => handlePressNotification(notification)
                        : undefined
                    }
                  />
                ))}
              </View>
            </View>
          ))}

          {isFetching && !refreshing && (
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
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markAllBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: Spacing.sm,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: Border.thin,
    overflow: 'hidden',
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
});
