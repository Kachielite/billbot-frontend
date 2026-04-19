import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Foundation } from '@expo/vector-icons';
import { Border, Radius, Spacing, TextAreaInput } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';

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

  const [isFocused, setIsFocused] = useState(false);

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
                backgroundColor: colors.surface,
                color: labelColor,
                borderColor: isFocused ? colors.primary : inputBorderColor,
                borderWidth: isFocused ? 2 : Border.thin,
              },
              isFocused && {
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 6,
                elevation: 4,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={colors.text.disabled}
            onBlur={() => {
              onBlur();
              setIsFocused(false);
            }}
            onFocus={() => setIsFocused(true)}
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
    ...TextStyles.label,
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
    ...TextStyles.label,
  },
});
