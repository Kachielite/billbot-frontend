import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import React from 'react';
import { GlassView } from 'expo-glass-effect';
import { Ionicons } from '@expo/vector-icons';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import { Expense } from '@/features/expenses/expenses.interface';
import moment from 'moment';

const FREQUENCY_LABEL: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

interface Props {
  expense: Expense;
}

export default function ExpenseHero({ expense }: Props) {
  const colors = useThemeColors();
  const emoji = expense.categoryEmoji ?? '💸';
  const description = expense.description ?? 'No description';
  const amount = expense.amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <GlassView
      tintColor={colors.primary}
      style={[styles.container, { backgroundColor: colors.primary }]}
    >
      <View style={[styles.emojiCircle, { backgroundColor: colors.primaryContainer }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      <Text
        style={[TextStyles.subtitleSmall, { color: colors.primaryCard.labelText }]}
        numberOfLines={2}
      >
        {description}
      </Text>

      <Text style={[TextStyles.displaySmall, { color: colors.text.inverse }]}>
        {expense.currency} {amount}
      </Text>

      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: colors.primaryCard.pillBg }]}>
          <Ionicons name="calendar-outline" size={11} color={colors.text.inverse} />
          <Text style={[TextStyles.captionBold, { color: colors.text.inverse }]}>
            {moment(expense.createdAt).format('MMM D, YYYY')}
          </Text>
        </View>

        {expense.isRecurring && expense.recurrenceFrequency && (
          <View style={[styles.badge, { backgroundColor: colors.primaryCard.pillBg }]}>
            <Ionicons name="repeat" size={11} color={colors.text.inverse} />
            <Text style={[TextStyles.captionBold, { color: colors.text.inverse }]}>
              {FREQUENCY_LABEL[expense.recurrenceFrequency] ?? expense.recurrenceFrequency}
            </Text>
          </View>
        )}
      </View>
    </GlassView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  emojiCircle: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  emoji: {
    fontSize: 26,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
});
