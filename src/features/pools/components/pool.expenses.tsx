import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { TextStyles } from '@/core/common/constants/fonts';
import { Radius, Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import SkeletonBox from '@/core/common/components/skeleton-box';
import { Expense } from '@/features/expenses/expenses.interface';
import { useNavigation } from '@react-navigation/native';
// removed unused Activity/getActivityEmoji imports
import moment from 'moment/moment';

const ExpenseCard = ({ expense }: { expense: Expense }) => {
  const colors = useThemeColors();

  const emoji = expense.categoryEmoji ?? '💸';

  // deterministic swatch from id
  const seed = expense.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const swatch = colors.groupColors[seed % colors.groupColors.length];

  const description = expense.description ?? 'No description';
  const amount = `${expense.currency || '$'} ${expense.amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const splits = expense.splits?.length ?? 0;
  const splitLabel = `Split ${splits} ${splits === 1 ? 'way' : 'ways'}`;
  const dateLabel = moment(expense.createdAt).format('MMMM D');

  return (
    <View style={[expenseCardStyles.activityCard, { backgroundColor: colors.surface }]}>
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
    </View>
  );
};

const expenseCardStyles = StyleSheet.create({
  activityCard: {
    paddingVertical: Spacing.sm,
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

type Props = {
  expenses: Expense[];
  isLoading: boolean;
};

export default function PoolExpenses({ expenses, isLoading }: Props) {
  const navigation = useNavigation();
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: Spacing.xs,
        }}
      >
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Expenses</Text>
        {expenses.length > 6 ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Tabs', { screen: 'Groups' });
            }}
          >
            <Text style={[TextStyles.label, { color: colors.primary }]}>See all</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View
        style={[
          styles.expensesContainer,
          { borderColor: colors.border.default, backgroundColor: colors.surface },
        ]}
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <View key={i} style={{ paddingVertical: Spacing.sm }}>
              <SkeletonBox width={'100%'} height={64} bg={colors.surface} />
            </View>
          ))
        ) : expenses.length === 0 ? (
          <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>No expenses yet</Text>
        ) : (
          expenses.map((exp, idx) => (
            <View
              key={exp.id}
              style={
                idx < expenses.length - 1
                  ? {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border.subtle,
                      paddingBottom: Spacing.sm,
                      marginBottom: Spacing.sm,
                    }
                  : undefined
              }
            >
              <ExpenseCard expense={exp} />
            </View>
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
    width: '100%',
  },
  expensesContainer: {
    flexDirection: 'column',
    gap: Spacing.sm,
    width: '100%',
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
});
