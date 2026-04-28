import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import React from 'react';
import moment from 'moment';
import { Expense } from '@/features/expenses/expenses.interface';
import { useNavigation } from '@react-navigation/native';
import { formatAmount } from '@/core/common/utils/currency';

export const ExpenseCard = ({ expense }: { expense: Expense }) => {
  const navigation = useNavigation();
  const colors = useThemeColors();

  const emoji = expense.categoryEmoji ?? '💸';

  // deterministic swatch from id
  const seed = expense.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const swatch = colors.groupColors[seed % colors.groupColors.length];

  const description = expense.description ?? 'No description';
  const amount = `${expense.currency || '$'} ${formatAmount(expense.amount)}`;
  const splits = expense.splits?.length ?? 0;
  const splitLabel = `Split ${splits} ${splits === 1 ? 'way' : 'ways'}`;
  const dateLabel = moment(expense.createdAt).format('MMMM D');

  return (
    <TouchableOpacity
      style={[
        expenseCardStyles.activityCard,
        { backgroundColor: colors.surface, borderColor: colors.border.default },
      ]}
      onPress={() =>
        navigation.navigate('Expense', { poolId: expense.poolId, expenseId: expense.id })
      }
    >
      <View
        style={[
          expenseCardStyles.emojiContainer,
          { backgroundColor: swatch.fill, borderColor: colors.surface },
        ]}
      >
        <Text style={{ color: swatch.on }}>{emoji}</Text>
      </View>

      <View style={{ flex: 1, flexDirection: 'column', marginLeft: Spacing.xs }}>
        <Text style={[TextStyles.bodySmall, { color: colors.text.primary }]} numberOfLines={1}>
          {description}
        </Text>
        <Text
          style={[TextStyles.amountMedium, { color: colors.text.secondary, marginTop: Spacing.xs }]}
        >
          {amount}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
        <Text style={[TextStyles.caption, { color: colors.text.secondary }]}>{splitLabel}</Text>
        <Text
          style={[TextStyles.captionBold, { color: colors.text.primary, marginTop: Spacing.sm }]}
        >
          {dateLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const expenseCardStyles = StyleSheet.create({
  activityCard: {
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: '100%',
    borderWidth: 1,
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
