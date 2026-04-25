import { StyleSheet } from 'react-native';
import React from 'react';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import NewExpenseHeader from '@/features/expenses/components/new-expense.header';
import NewExpenseForm from '@/features/expenses/components/new-expense-form';
import useLogExpense from '@/features/expenses/hooks/use-log-expense';
import CustomButton from '@/core/common/components/form/custom-button';
import usePoolsStore from '@/features/pools/pools.state';

export default function NewExpenseScreen() {
  const { selectedPool } = usePoolsStore();
  const { form, onLogExpense } = useLogExpense(selectedPool?.id ?? '');
  return (
    <ScreenContainer useScrollView={false}>
      <NewExpenseHeader />
      <NewExpenseForm form={form} poolId={selectedPool?.id ?? ''} />
      <CustomButton label={'Log Expense'} onPress={onLogExpense} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({});
