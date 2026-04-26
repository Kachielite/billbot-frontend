import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { UpcomingExpense } from '@/features/expenses/expenses.interface';
import moment from 'moment';
import { formatAmount } from '@/core/common/utils/currency';

type Props = {
  upcoming: UpcomingExpense;
  isLast?: boolean;
};

const getDueLabel = (date: Date): string => {
  const now = moment().startOf('day');
  const target = moment(date).startOf('day');
  const diff = target.diff(now, 'days');
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  if (diff > 1 && diff <= 6) return `Due in ${diff} days`;
  return `Due ${target.format('MMM D')}`;
};

export default function UpcomingCard({ upcoming, isLast = false }: Props) {
  const colors = useThemeColors();

  const emoji = upcoming.categoryEmoji ?? '📅';
  const dueLabel = getDueLabel(upcoming.nextOccurrenceAt);
  const amount = formatAmount(upcoming.amount);
  const isDueToday = moment(upcoming.nextOccurrenceAt)
    .startOf('day')
    .isSame(moment().startOf('day'));

  return (
    <View
      style={[
        styles.card,
        {
          borderBottomColor: isLast ? 'transparent' : colors.border.subtle,
          borderBottomWidth: isLast ? 0 : 1,
        },
      ]}
    >
      <View style={[styles.emojiContainer, { backgroundColor: colors.primaryContainer }]}>
        <Text>{emoji}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[TextStyles.bodySmall, { color: colors.text.primary }]} numberOfLines={1}>
          {upcoming.description ?? 'Upcoming expense'}
        </Text>
        <Text
          style={[TextStyles.caption, { color: isDueToday ? colors.error : colors.text.secondary }]}
        >
          {dueLabel}
        </Text>
      </View>
      <Text style={[TextStyles.amountSmall, { color: colors.text.primary }]}>
        {upcoming.currency} {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
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
});
