import { StyleSheet, Text } from 'react-native';
import React from 'react';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import NewExpenseHeader from '@/features/expenses/components/new-expense.header';
import NewExpenseForm from '@/features/expenses/components/new-expense-form';

export default function NewExpenseScreen() {
  return (
    <ScreenContainer>
      <NewExpenseHeader />
      <NewExpenseForm />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({});
