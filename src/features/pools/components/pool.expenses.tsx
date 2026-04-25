import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { TextStyles } from '@/core/common/constants/fonts';
import { Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import SkeletonBox from '@/core/common/components/skeleton-box';
import { Expense } from '@/features/expenses/expenses.interface';
import { useNavigation } from '@react-navigation/native';
import usePoolsStore from '@/features/pools/pools.state';
import { ExpenseCard } from '@/features/expenses/components/expense.card';

type Props = {
  expenses: Expense[];
  isLoading: boolean;
};

export default function PoolExpenses({ expenses, isLoading }: Props) {
  const { selectedPool } = usePoolsStore();
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
        {expenses.length > 4 ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Expenses', { poolId: selectedPool?.id ?? '' });
            }}
          >
            <Text style={[TextStyles.label, { color: colors.primary }]}>See all</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={[styles.expensesContainer]}>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <View key={i} style={{ paddingVertical: Spacing.sm }}>
              <SkeletonBox width={'100%'} height={64} bg={colors.surface} />
            </View>
          ))
        ) : expenses.length === 0 ? (
          <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>No expenses yet</Text>
        ) : (
          expenses.slice(0, 4).map((exp) => <ExpenseCard expense={exp} key={exp.id} />)
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
  },
});
