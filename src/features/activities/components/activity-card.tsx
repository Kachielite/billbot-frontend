import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Activity } from '@/features/activities/activities.interface';
import { getActivityEmoji } from '@/core/common/constants/activity-icons';
import moment from 'moment';

type Props = {
  activity: Activity;
  isLast?: boolean;
};

const buildMessage = (activity: Activity): string => {
  const actorName = activity.actor?.name?.split(' ')[0] ?? 'Someone';
  const meta: any = activity.metadata;
  switch (activity.type) {
    case 'expense.created':
      return meta.description
        ? `${actorName} logged "${meta.description}"`
        : `${actorName} logged an expense`;
    case 'expense.deleted':
      return `${actorName} deleted an expense`;
    case 'settlement.submitted': {
      const amt = Number(meta.amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${actorName} submitted a payment of ${meta.currency} ${amt}`;
    }
    case 'settlement.confirmed': {
      const amt = Number(meta.amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${actorName} confirmed payment of ${meta.currency} ${amt}`;
    }
    case 'settlement.disputed':
      return `${actorName} disputed a payment` + (meta.reason ? `: ${meta.reason}` : '');
    default:
      return `${actorName} did something`;
  }
};

export default function ActivityCard({ activity, isLast = false }: Props) {
  const colors = useThemeColors();

  const isExpense = activity.type.startsWith('expense');
  const categoryEmoji = (activity.metadata as any).category?.emoji;
  const emoji = isExpense
    ? (categoryEmoji ?? getActivityEmoji(activity.type))
    : getActivityEmoji(activity.type);

  const message = buildMessage(activity);
  const timeLabel = moment(activity.createdAt).fromNow();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderBottomColor: isLast ? 'transparent' : colors.border.subtle,
          borderBottomWidth: isLast ? 0 : 1,
        },
      ]}
    >
      <View style={[styles.emojiContainer, { backgroundColor: colors.primaryContainer }]}>
        <Text>{emoji}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text
            style={[TextStyles.subtitleSmall, { color: colors.text.secondary }]}
            numberOfLines={1}
          >
            {activity.pool?.name ?? 'Activity'}
          </Text>
          <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>{timeLabel}</Text>
        </View>
        <Text style={[TextStyles.bodySmall, { color: colors.text.primary }]} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: '100%',
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
});
