import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import React from 'react';
import NewPoolHeader from '@/features/pools/components/new-pool.header';
import PoolInfo from '@/features/pools/components/pool-info';
import useCreatePool from '@/features/pools/hooks/use-create-pool';
import NewPoolForm from '@/features/pools/components/new-pool.form';
import type { StaticScreenProps } from '@react-navigation/native';
import { Spacing } from '@/core/common/constants/theme';

type Props = StaticScreenProps<{ groupId: string }>;

export default function NewPoolScreen({ route }: Props) {
  const { groupId } = route.params;
  const { form, createPoolHandler } = useCreatePool(groupId);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <NewPoolHeader />
      <PoolInfo />
      <NewPoolForm formController={form} onCreatePool={createPoolHandler} />
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    gap: Spacing.lg,
  },
});
