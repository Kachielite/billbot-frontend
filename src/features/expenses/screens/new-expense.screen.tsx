import { StyleSheet } from 'react-native';
import React from 'react';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import NewExpenseHeader from '@/features/expenses/components/new-expense.header';
import NewExpenseForm from '@/features/expenses/components/new-expense-form';
import useLogExpense from '@/features/expenses/hooks/use-log-expense';
import CustomButton from '@/core/common/components/form/custom-button';

export default function NewExpenseScreen() {
  const { form } = useLogExpense('23');
  return (
    <ScreenContainer useScrollView={false}>
      <NewExpenseHeader />
      <NewExpenseForm form={form} />
      <CustomButton label={'Log Expense'} onPress={form.handleSubmit(() => {})} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({});
