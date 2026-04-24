import { StyleSheet, View } from 'react-native';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UpdatePoolSchemaType } from '@/features/pools/pools.dto';
import { Radius, Spacing } from '@/core/common/constants/theme';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import CustomButton from '@/core/common/components/form/custom-button';

interface EditPoolFormProps {
  formController: UseFormReturn<UpdatePoolSchemaType>;
  onUpdatePool: () => Promise<void>;
  isUpdating: boolean;
}

export default function EditPoolForm({
  formController,
  onUpdatePool,
  isUpdating,
}: EditPoolFormProps) {
  return (
    <View style={styles.formContainer}>
      <CustomTextInput
        label="TAB NAME"
        id="name"
        formController={formController}
        hint="e.g. January Bill, Ibadan Weekend, Office lunch"
        required
      />
      <CustomButton
        loading={isUpdating}
        label={isUpdating ? 'Updating...' : 'Save Changes'}
        onPress={async () => onUpdatePool()}
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
  memberOptionContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  memberOption: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
});
