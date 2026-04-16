import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Activity } from '@/features/activities/activities.interface';
import { getActivityEmoji } from '@/core/common/constants/activity-icons';
import moment from 'moment';
import useActivities from '@/features/activities/hooks/use-activities';
import SkeletonBox from '@/core/common/components/skeleton-box';
import EmptyState from '@/core/common/components/empty-state';

// TODO: Remove this mock data once you create the data
const ACTIVITIES_MOCK: Activity[] = [
  {
    id: 'a1',
    actor: { id: 'u1', name: 'Derrick', avatarUrl: null },
    pool: { id: 'p1', name: 'Household' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    type: 'expense.created',
    metadata: {
      expenseId: 'e1',
      amount: 1250.5,
      currency: 'NGN',
      description: 'Groceries',
      category: { id: 'c1', name: 'Food', emoji: '🍎' },
    },
  },
  {
    id: 'a2',
    actor: { id: 'u2', name: 'Ada', avatarUrl: null },
    pool: { id: 'p2', name: 'Trip' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    type: 'expense.deleted',
    metadata: { expenseId: 'e2' },
  },
  {
    id: 'a3',
    actor: { id: 'u3', name: 'Tobi', avatarUrl: null },
    pool: { id: 'p3', name: 'Office' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    type: 'settlement.confirmed',
    metadata: { settlementId: 's2', amount: 200, currency: 'NGN', fromUserId: 'u2' },
  },
  {
    id: 'a4',
    actor: { id: 'u4', name: 'Simi', avatarUrl: null },
    pool: { id: 'p1', name: 'Household' },
    createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    type: 'settlement.submitted',
    metadata: { settlementId: 's1', amount: 500, currency: 'NGN', toUserId: 'u1' },
  },
];

const ActivityCard = ({ activity }: { activity: Activity }) => {
  const colors = useThemeColors();

  const isExpense = activity.type.startsWith('expense');
  const categoryEmoji = (activity.metadata as any).category?.emoji;
  const emoji = isExpense
    ? (categoryEmoji ?? getActivityEmoji(activity.type))
    : getActivityEmoji(activity.type);

  // Build human readable message based on activity type
  const actorName = activity.actor?.name ?? 'Someone';
  let message = '';
  const meta: any = activity.metadata;
  switch (activity.type) {
    case 'expense.created':
      message = meta.description
        ? `${actorName} logged an expense: ${meta.description}`
        : `${actorName} logged an expense`;
      break;
    case 'expense.deleted':
      message = `${actorName} deleted an expense`;
      break;
    case 'settlement.submitted':
      message = `${actorName} submitted payment of ${meta.amount} ${meta.currency}`;
      break;
    case 'settlement.confirmed':
      message = `${actorName} confirmed payment of ${meta.amount} ${meta.currency}`;
      break;
    case 'settlement.disputed':
      message = `${actorName} disputed a payment` + (meta.reason ? `: ${meta.reason}` : '');
      break;
    default:
      message = `${actorName} did something`;
  }

  const timeLabel = moment(activity.createdAt).fromNow();

  return (
    <View
      style={[
        activityStyles.activityCard,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border.subtle,
          borderBottomWidth: 1,
        },
      ]}
    >
      <View style={[activityStyles.emojiContainer, { backgroundColor: colors.primaryContainer }]}>
        <Text>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={[TextStyles.subtitleSmall, { color: colors.text.secondary }]}>
            {activity.pool ? `${activity.pool.name}` : 'Activity'}
          </Text>
          <Text style={[TextStyles.caption, { color: colors.text.secondary }]}>{timeLabel}</Text>
        </View>
        <Text style={[TextStyles.bodySmall, { color: colors.text.primary }]}>{message}</Text>
      </View>
    </View>
  );
};

const activityStyles = StyleSheet.create({
  activityCard: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default function HomeActivities() {
  const colors = useThemeColors();
  const { activities, isLoading } = useActivities();
  const activitiesToDisplay = activities;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Recent Activities</Text>
        {activitiesToDisplay.length > 0 ? (
          <Text style={[{ color: colors.onPrimaryContainer }]}>See All</Text>
        ) : null}
      </View>
      <View style={[styles.cardContainer, { backgroundColor: colors.surface }]}>
        {isLoading ? (
          // show 4 skeleton rows while loading
          Array.from({ length: 4 }).map((_, i) => (
            <View key={i} style={{ padding: Spacing.md }}>
              <SkeletonBox width={'100%'} height={64} bg={colors.surface} />
            </View>
          ))
        ) : activitiesToDisplay.length === 0 ? (
          <EmptyState
            title="No recent activity"
            subtitle="You don't have any recent activity yet."
          />
        ) : (
          activitiesToDisplay.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.md,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.sm,
    borderRadius: Radius.lg,
  },
});
