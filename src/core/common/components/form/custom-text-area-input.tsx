import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Foundation } from '@expo/vector-icons';
import { Border, Radius, Spacing, TextAreaInput, TextStyles } from '@/core/common/constants/theme';

interface Props<T extends FieldValues> {
  id: Path<T>;
  formController: UseFormReturn<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  numberOfLines?: number;
  maxLength?: number;
}

export default function CustomTextAreaInput<T extends FieldValues>({
  label,
  placeholder,
  id,
  formController,
  required,
  numberOfLines = 4,
  maxLength = -1,
}: Props<T>) {
  const colors = useThemeColors();

  const {
    control,
    formState: { errors },
  } = formController;
  const errorMessage = errors[id]?.message as string | undefined;

  const labelColor = errorMessage ? colors.error : colors.text.primary;
  const asteriskColor = errorMessage ? colors.error : colors.text.primary;
  const inputBorderColor = errorMessage ? colors.error : colors.border.default;

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
        {required && (
          <Foundation style={styles.asterisk} name="asterisk" size={10} color={asteriskColor} />
        )}
      </View>
      <Controller
        control={control}
        name={id}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              {
                color: labelColor,
                borderColor: inputBorderColor,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={colors.text.inverse}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ?? ''}
            multiline
            numberOfLines={numberOfLines}
            maxLength={maxLength === -1 ? undefined : maxLength}
          />
        )}
      />
      {errorMessage && <Text style={[styles.error, { color: colors.error }]}>{errorMessage}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  label: {
    ...TextStyles.labelSmall,
  },
  asterisk: {
    marginTop: 2,
  },
  input: {
    ...TextAreaInput,
    borderWidth: Border.thin,
    borderRadius: Radius.md,
  },
  error: {
    ...TextStyles.labelSmall,
  },
});
