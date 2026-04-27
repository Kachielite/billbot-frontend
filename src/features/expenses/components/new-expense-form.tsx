import { Platform, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import React from 'react';
import ExpenseParseReceipt from '@/features/expenses/components/expense.parse-receipt';
import { Controller } from 'react-hook-form';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import { Spacing } from '@/core/common/constants/theme';
import useCategories from '@/features/categories/hooks/use-categories';
import CustomDropdown from '@/core/common/components/form/custom-dropdown';
import useExpensesStore from '@/features/expenses/expenses.state';
import SplitExpense from '@/features/expenses/components/split.expense';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import type { LogExpenseFormReturn } from '@/features/expenses/hooks/use-log-expense';

type NewExpenseFormProps = {
  form: LogExpenseFormReturn;
  poolId: string;
};

export default function NewExpenseForm({ form, poolId }: NewExpenseFormProps) {
  const { isParsingReceipt } = useExpensesStore();
  const colors = useThemeColors();
  const categoriesQuery = useCategories();
  const sortedCategories = React.useMemo(() => {
    if (!categoriesQuery.categories) return [];
    return [...categoriesQuery.categories].sort((a, b) => a.name.localeCompare(b.name));
  }, [categoriesQuery.categories]);
  const categoryOptions = sortedCategories.map((c) => ({
    label: `${c.emoji} ${c.name}`,
    value: c.id,
  }));
  const isLoading = categoriesQuery.isLoading || isParsingReceipt;
  const isRecurring = form.watch('isRecurring');

  const recurrenceOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Bi-weekly', value: 'biweekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <ExpenseParseReceipt form={form} poolId={poolId} />
        <CustomTextInput
          label="AMOUNT"
          id="amount"
          type="number"
          formController={form}
          disabled={isLoading}
          required
        />
        <CustomTextInput
          label="DESCRIPTION (optional)"
          id="description"
          formController={form}
          disabled={isLoading}
        />
        <CustomDropdown
          label="CATEGORY"
          id="categoryId"
          formController={form}
          options={categoryOptions}
          disabled={isLoading}
        />

        <SplitExpense form={form} />

        {/* ── Recurring row ── */}
        <View style={styles.recurringRow}>
          {/* isRecurring toggle */}
          <View style={styles.toggleBlock}>
            <Text style={[TextStyles.label, { color: colors.text.primary }]}>RECURRING</Text>
            <Controller
              control={form.control}
              name="isRecurring"
              render={({ field: { value, onChange } }) => (
                <View style={styles.switchWrapper}>
                  <Switch
                    value={!!value}
                    onValueChange={onChange}
                    trackColor={{ false: colors.border.default, true: colors.primary }}
                    thumbColor={value ? colors.onPrimary : colors.surface}
                    style={Platform.OS === 'android' ? styles.switchAndroid : undefined}
                  />
                </View>
              )}
            />
          </View>

          {/* recurrenceFrequency dropdown */}
          <View style={styles.frequencyBlock}>
            <CustomDropdown
              label="FREQUENCY"
              id="recurrenceFrequency"
              formController={form}
              options={recurrenceOptions}
              disabled={!isRecurring}
              placeholder="Select frequency"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: Spacing.md,
  },
  recurringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  toggleBlock: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  switchWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  switchAndroid: {
    transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }],
  },
  frequencyBlock: {
    flex: 1,
  },
});
