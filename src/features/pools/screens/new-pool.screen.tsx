import React from 'react';
import NewPoolHeader from '@/features/pools/components/new-pool.header';
import useCreatePool from '@/features/pools/hooks/use-create-pool';
import NewPoolForm from '@/features/pools/components/new-pool.form';
import type { StaticScreenProps } from '@react-navigation/native';
import CustomFormSheet from '@/core/common/components/layout/custom-formsheet';
import InfoBox from '@/core/common/components/info-box';

type Props = StaticScreenProps<{ groupId: string }>;

export default function NewPoolScreen({ route }: Props) {
  const { groupId } = route.params;
  const { form, createPoolHandler, isCreating } = useCreatePool(groupId);

  return (
    <CustomFormSheet>
      <NewPoolHeader />
      <InfoBox
        title="A tab collects related expenses."
        description="Think monthly bills, a trip, or an event, so you settle them together instead of one by
          one."
      />
      <NewPoolForm formController={form} onCreatePool={createPoolHandler} isCreating={isCreating} />
    </CustomFormSheet>
  );
}
