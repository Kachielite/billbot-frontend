import { StyleSheet, Text } from 'react-native';
import React from 'react';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import NewPoolHeader from '@/features/pools/components/new-pool.header';
import PoolInfo from '@/features/pools/components/pool-info';
import useCreatePool from '@/features/pools/hooks/use-create-pool';
import NewPoolForm from '@/features/pools/components/new-pool.form';
import type { StaticScreenProps } from '@react-navigation/native';

type Props = StaticScreenProps<{ groupId: string }>;

export default function NewPoolScreen({ route }: Props) {
  const { groupId } = route.params;
  const { isCreating, createPool, form } = useCreatePool(groupId);
  return (
    <ScreenContainer>
      <NewPoolHeader />
      <PoolInfo />
      <NewPoolForm formController={form} />
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({});
