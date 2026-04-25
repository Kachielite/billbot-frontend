import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { JSX, useState } from 'react';
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
  hint?: string;
  disabled?: boolean;
  /**
   * Input type controls keyboard and input behavior.
   * - text: default keyboard
   * - email: email-address keyboard, no auto-capitalize
   * - number: numeric keyboard
   * - phone: phone-pad keyboard
   * - password: secure text entry
   * - url: url keyboard
   */
  type?: 'text' | 'email' | 'number' | 'phone' | 'password' | 'url';
}

export default function CustomTextInput<T extends FieldValues>({
  label,
  placeholder,
  id,
  formController,
  required,
  hint,
  type,
  disabled = false,
}: Props<T>): JSX.Element {
  const colors = useThemeColors();

  const {
    control,
    formState: { errors },
  } = formController;
  const errorMessage = errors[id]?.message as string | undefined;

  const [isFocused, setIsFocused] = useState(false);

  const getInputProps = (t?: Props<T>['type']) => {
    switch (t) {
      case 'email':
        return {
          keyboardType: 'email-address' as const,
          autoCapitalize: 'none' as const,
          textContentType: 'emailAddress' as const,
          autoComplete: 'email' as const,
        };
      case 'number':
        return {
          keyboardType: 'numeric' as const,
          autoCapitalize: 'none' as const,
        };
      case 'phone':
        return {
          keyboardType: 'phone-pad' as const,
          autoCapitalize: 'none' as const,
        };
      case 'password':
        return {
          secureTextEntry: true,
          textContentType: 'password' as const,
          autoComplete: 'password' as const,
        };
      case 'url':
        return {
          keyboardType: 'url' as const,
          autoCapitalize: 'none' as const,
          textContentType: 'URL' as const,
        };
      case 'text':
      default:
        return {
          keyboardType: 'default' as const,
          autoCapitalize: 'sentences' as const,
        };
    }
  };

  const inputProps = getInputProps(type);

  const labelColor = errorMessage ? colors.error : colors.text.primary;
  const asteriskColor = errorMessage ? colors.error : colors.primary;
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
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: colors.surface,
                borderColor: disabled
                  ? colors.border.subtle
                  : isFocused
                    ? colors.primary
                    : inputBorderColor,
                borderWidth: isFocused ? 2 : Border.thin,
              },
              isFocused &&
                !disabled && {
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.25,
                  shadowRadius: 6,
                  elevation: 4,
                },
              disabled && { opacity: 0.6 },
            ]}
          >
            <TextInput
              style={[styles.input, { color: labelColor }]}
              placeholder={placeholder}
              placeholderTextColor={colors.text.disabled}
              onBlur={() => {
                onBlur();
                setIsFocused(false);
              }}
              onFocus={() => setIsFocused(true)}
              onChangeText={onChange}
              value={value == null ? '' : String(value)}
              editable={!disabled}
              {...inputProps}
            />
          </View>
        )}
      />
      {!errorMessage && hint && (
        <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>{hint}</Text>
      )}
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
  inputWrapper: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  input: {
    ...Input,
    backgroundColor: 'transparent',
  },
  error: {
    ...TextStyles.label,
  },
});
