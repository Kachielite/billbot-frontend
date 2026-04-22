import React from 'react';
import NewPoolHeader from '@/features/pools/components/new-pool.header';
import PoolInfo from '@/features/pools/components/pool-info';
import useCreatePool from '@/features/pools/hooks/use-create-pool';
import NewPoolForm from '@/features/pools/components/new-pool.form';
import type { StaticScreenProps } from '@react-navigation/native';
import CustomFormSheet from '@/core/common/components/layout/custom-formsheet';

type Props = StaticScreenProps<{ groupId: string }>;

export default function NewPoolScreen({ route }: Props) {
  const { groupId } = route.params;
  const { form, createPoolHandler, isCreating } = useCreatePool(groupId);

  return (
    <CustomFormSheet>
      <NewPoolHeader />
      <PoolInfo />
      <NewPoolForm formController={form} onCreatePool={createPoolHandler} isCreating={isCreating} />
    </CustomFormSheet>
  );
}
