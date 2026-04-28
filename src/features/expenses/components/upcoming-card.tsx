import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { UpcomingExpense } from '@/features/expenses/expenses.interface';
import moment from 'moment';
import { formatAmount } from '@/core/common/utils/currency';

type Props = {
  upcoming: UpcomingExpense;
  onPress?: () => void;
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

const FREQUENCY_LABEL: Record<UpcomingExpense['recurrenceFrequency'], string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export default function UpcomingCard({ upcoming, onPress }: Props) {
  const colors = useThemeColors();

  const emoji = upcoming.categoryEmoji ?? '📅';
  const dueLabel = getDueLabel(upcoming.nextOccurrenceAt);
  const amount = formatAmount(upcoming.amount);
  const isDueToday = moment(upcoming.nextOccurrenceAt)
    .startOf('day')
    .isSame(moment().startOf('day'));
  const frequencyLabel = FREQUENCY_LABEL[upcoming.recurrenceFrequency];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border.subtle }]}
    >
      <View style={[styles.emojiContainer, { backgroundColor: colors.primaryContainer }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      <View style={styles.content}>
        <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]} numberOfLines={1}>
          {upcoming.description ?? 'Upcoming expense'}
        </Text>
        <Text
          style={[TextStyles.caption, { color: isDueToday ? colors.error : colors.text.secondary }]}
        >
          {dueLabel}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={[TextStyles.amountSmall, { color: colors.text.primary }]}>
          {upcoming.currency} {amount}
        </Text>
        <Text style={[TextStyles.caption, { color: colors.text.secondary }]}>{frequencyLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  emojiContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
});
