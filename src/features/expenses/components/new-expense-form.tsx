import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import ExpenseParseReceipt from '@/features/expenses/components/expense.parse-receipt';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import { Border, Radius, Spacing } from '@/core/common/constants/theme';
import useCategories from '@/features/categories/hooks/use-categories';
import CustomDropdown from '@/core/common/components/form/custom-dropdown';
import useExpensesStore from '@/features/expenses/expenses.state';
import SplitExpense from '@/features/expenses/components/split.expense';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import type { LogExpenseFormReturn } from '@/features/expenses/hooks/use-log-expense';

const FREQUENCY_CHIPS = [
  { label: 'No Recurrence', value: null },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Bi-weekly', value: 'biweekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
] as const;

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
  const recurrenceFrequency = form.watch('recurrenceFrequency');
  const selectedChip = isRecurring ? (recurrenceFrequency ?? null) : null;

  const handleFrequencyChip = (value: string | null) => {
    if (value === null) {
      form.setValue('isRecurring', false, { shouldValidate: true, shouldDirty: true });
      form.setValue('recurrenceFrequency', undefined, { shouldValidate: true, shouldDirty: true });
    } else {
      form.setValue('isRecurring', true, { shouldValidate: true, shouldDirty: true });
      form.setValue('recurrenceFrequency', value as any, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

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

        {/* ── Frequency chips ── */}
        <View style={styles.chipsSection}>
          <Text style={[TextStyles.label, { color: colors.text.primary }]}>FREQUENCY</Text>
          <View style={styles.chipsRow}>
            {FREQUENCY_CHIPS.map((chip) => {
              const isSelected = chip.value === selectedChip;
              return (
                <TouchableOpacity
                  key={chip.value ?? 'none'}
                  onPress={() => handleFrequencyChip(chip.value)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border.default,
                    },
                  ]}
                >
                  <Text
                    style={[
                      TextStyles.label,
                      { color: isSelected ? colors.primary : colors.text.secondary },
                    ]}
                  >
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
  chipsSection: {
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: Border.thin,
  },
});
