import React from 'react';
import NewPoolHeader from '@/features/pools/components/new-pool.header';
import type { StaticScreenProps } from '@react-navigation/native';
import CustomFormSheet from '@/core/common/components/layout/custom-formsheet';
import EditPoolForm from '@/features/pools/components/edit-pool.form';
import useUpdatePool from '@/features/pools/hooks/use-update-pool';

type Props = StaticScreenProps<{ poolId: string }>;

export default function EditPoolScreen({ route }: Props) {
  const { poolId } = route.params;
  const { form, isUpdating, onUpdatePool } = useUpdatePool(poolId);

  return (
    <CustomFormSheet>
      <NewPoolHeader mode="edit" />
      <EditPoolForm formController={form} onUpdatePool={onUpdatePool} isUpdating={isUpdating} />
    </CustomFormSheet>
  );
}
