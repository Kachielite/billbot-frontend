import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { JSX } from 'react';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Foundation } from '@expo/vector-icons';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Input, Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';

interface Props<T extends FieldValues> {
  id: Path<T>;
  formController: UseFormReturn<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export default function CustomTextInput<T extends FieldValues>({
  label,
  placeholder,
  id,
  formController,
  required,
}: Props<T>): JSX.Element {
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
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  label: {
    ...TextStyles.label,
  },
  asterisk: {
    marginTop: 2,
    marginLeft: Spacing.xs,
  },
  input: {
    ...Input,
    borderWidth: Border.thin,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
  error: {
    ...TextStyles.label,
  },
});
