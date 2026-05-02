import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import ExpenseParseReceipt from '@/features/expenses/components/expense.parse-receipt';
import { Controller } from 'react-hook-form';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import { Border, Radius, Spacing } from '@/core/common/constants/theme';
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
          <View style={styles.toggleBlock}>
            <Text style={[TextStyles.label, { color: colors.text.primary }]}>RECURRING</Text>
            <Controller
              control={form.control}
              name="isRecurring"
              render={({ field: { value, onChange } }) => (
                <Switch
                  value={!!value}
                  onValueChange={(next) => {
                    onChange(next);
                    if (next) {
                      form.setValue('recurrenceFrequency', 'daily');
                    } else {
                      form.setValue('recurrenceFrequency', undefined as any);
                    }
                  }}
                  trackColor={{ false: colors.border.default, true: colors.primary }}
                  thumbColor={value ? colors.onPrimary : colors.surface}
                  style={Platform.OS === 'android' ? styles.switchAndroid : undefined}
                />
              )}
            />
          </View>

          <View style={[styles.frequencyBlock, !isRecurring && styles.frequencyDisabled]}>
            <Text style={[TextStyles.label, { color: colors.text.primary }]}>FREQUENCY</Text>
            <Controller
              control={form.control}
              name="recurrenceFrequency"
              render={({ field: { value, onChange } }) => (
                <View style={styles.chipRow}>
                  {recurrenceOptions.map((option) => {
                    const selected = value === option.value && isRecurring;
                    return (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => onChange(option.value)}
                        activeOpacity={0.7}
                        disabled={!isRecurring}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: selected ? colors.primary : colors.surface,
                            borderColor: selected ? colors.primary : colors.border.default,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            { color: selected ? colors.onPrimary : colors.text.primary },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
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
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  toggleBlock: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  frequencyBlock: {
    flex: 1,
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  frequencyDisabled: {
    opacity: 0.4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  switchAndroid: {
    transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }],
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xl,
    borderWidth: Border.thin,
  },
  chipText: {
    ...TextStyles.label,
  },
});
