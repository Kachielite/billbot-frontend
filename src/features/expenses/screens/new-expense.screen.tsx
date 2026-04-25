import { StyleSheet, Text } from 'react-native';
import React from 'react';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import NewExpenseHeader from '@/features/expenses/components/new-expense.header';
import NewExpenseForm from '@/features/expenses/components/new-expense-form';
import useLogExpense from '@/features/expenses/hooks/use-log-expense';

export default function NewExpenseScreen() {
  const { form } = useLogExpense('23');
  return (
    <ScreenContainer>
      <NewExpenseHeader />
      <NewExpenseForm form={form} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({});
