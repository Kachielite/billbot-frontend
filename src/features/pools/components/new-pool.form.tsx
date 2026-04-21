import { StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreatePoolSchemaType } from '@/features/pools/pools.dto';
import { Spacing } from '@/core/common/constants/theme';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import CustomTextAreaInput from '@/core/common/components/form/custom-text-area-input';
import CustomDropdown, { DropdownOption } from '@/core/common/components/form/custom-dropdown';
import useGroups from '@/features/groups/hooks/use-groups';
import useGroupsStore from '@/features/groups/groups.state';
import { Group } from '@/features/groups/groups.interface';

interface NewPoolFormProps {
  formController: UseFormReturn<CreatePoolSchemaType>;
}

export default function NewPoolForm({ formController }: NewPoolFormProps) {
  const { selectedGroup } = useGroupsStore();

  const membersOptions = useMemo(() => {
    return (selectedGroup as Group)?.members?.map((member) => ({
      label: member.name,
      value: member.userId,
    }));
  }, [selectedGroup]);

  return (
    <View style={styles.formContainer}>
      <CustomTextInput
        label="TAB NAME"
        id="name"
        formController={formController}
        hint="e.g. January Bill, Ibadan Weekend, Office lunch"
        required
      />
      <CustomTextAreaInput
        label="DESCRIPTION (optional)"
        id="description"
        formController={formController}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.xl,
  },
});
