import { StyleSheet, View } from 'react-native';
import React from 'react';
import ExpenseParseReceipt from '@/features/expenses/components/expense.parse-receipt';
import { UseFormReturn } from 'react-hook-form';
import { LogExpenseSchemaType } from '@/features/expenses/expenses.dto';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import { Spacing } from '@/core/common/constants/theme';
import CustomTextAreaInput from '@/core/common/components/form/custom-text-area-input';
import useCategories from '@/features/categories/hooks/use-categories';
import CustomDropdown from '@/core/common/components/form/custom-dropdown';
import useExpensesStore from '@/features/expenses/expenses.state';

type NewExpenseFormProps = {
  form: UseFormReturn<LogExpenseSchemaType>;
};

export default function NewExpenseForm({ form }: NewExpenseFormProps) {
  const { isParsingReceipt } = useExpensesStore();
  const categoriesQuery = useCategories();
  const categoryOptions = categoriesQuery.categories.map((c) => ({
    label: `${c.emoji} ${c.name}`,
    value: c.id,
  }));
  const isLoading = categoriesQuery.isLoading || isParsingReceipt;

  return (
    <View style={styles.container}>
      <ExpenseParseReceipt />
      <CustomTextInput
        label="AMOUNT"
        id="amount"
        type="number"
        formController={form}
        disabled={isLoading}
        required
      />
      <CustomTextAreaInput
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
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: Spacing.md,
  },
});
