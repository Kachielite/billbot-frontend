import { StyleSheet, View } from 'react-native';
import React from 'react';
import ExpenseParseReceipt from '@/features/expenses/components/expense.parse-receipt';

export default function NewExpenseForm() {
  return (
    <View>
      <ExpenseParseReceipt />
    </View>
  );
}
const styles = StyleSheet.create({});
