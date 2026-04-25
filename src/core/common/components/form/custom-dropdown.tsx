import React, { useState } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Foundation, Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { Border, Input, Radius, Spacing } from '@/core/common/constants/theme';
import { Fonts, FontSize, TextStyles } from '@/core/common/constants/fonts';

export interface DropdownOption<T = string | number> {
  label: string;
  value: T;
}

interface Props<T extends FieldValues, V = string | number> {
  id: Path<T>;
  formController: UseFormReturn<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options: DropdownOption<V>[];
  disabled?: boolean;
}

export default function CustomDropdown<T extends FieldValues, V = string | number>({
  id,
  formController,
  label,
  required,
  placeholder,
  options,
  disabled = false,
}: Props<T, V>) {
  const colors = useThemeColors();
  const scheme = useColorScheme();
  const [isOpen, setIsOpen] = useState(false);

  const {
    formState: { errors },
  } = formController;
  const errorMessage = errors[id]?.message as string | undefined;
  const currentValue = (formController.watch(id) as unknown as V) ?? null;

  const items = React.useMemo(
    () => options.map((o) => ({ label: o.label, value: o.value as any })),
    [options],
  );

  const labelColor = errorMessage ? colors.error : colors.text.primary;
  const borderColor = errorMessage
    ? colors.error
    : isOpen
      ? colors.primary
      : disabled
        ? colors.border.subtle
        : colors.border.default;

  const inputStyle = {
    height: Input.height,
    paddingHorizontal: Input.paddingHorizontal,
    paddingRight: 40,
    borderRadius: Radius.md,
    borderWidth: isOpen ? 2 : Border.thin,
    borderColor,
    backgroundColor: colors.surface,
    color: colors.text.primary,
    fontFamily: Fonts.regular,
    fontSize: FontSize.sm,
  };

  const wrapperStyle = [
    styles.pickerWrapper,
    isOpen &&
      !disabled && {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
      },
    disabled && { opacity: 0.6 },
  ];

  const picker = (
    <RNPickerSelect
      items={items}
      value={currentValue}
      onValueChange={(value) => {
        formController.setValue(id as any, (value ?? undefined) as any, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }}
      placeholder={{
        label: placeholder ?? 'Select an option',
        value: null,
        color: colors.text.disabled,
      }}
      disabled={disabled}
      useNativeAndroidPickerStyle={false}
      darkTheme={scheme === 'dark'}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      style={{
        inputIOS: inputStyle,
        inputAndroid: inputStyle,
        placeholder: {
          color: colors.text.disabled,
          fontFamily: Fonts.regular,
          fontSize: FontSize.sm,
        },
      }}
    />
  );

  const icon = (
    <View style={styles.iconOverlay} pointerEvents="none">
      <Ionicons
        name={isOpen ? 'chevron-up' : 'chevron-down'}
        size={18}
        color={disabled ? colors.text.disabled : colors.text.secondary}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
          {required && (
            <Foundation style={styles.asterisk} name="asterisk" size={10} color={labelColor} />
          )}
        </View>
      )}

      <View style={wrapperStyle}>
        {picker}
        {icon}
      </View>

      {errorMessage && <Text style={[styles.error, { color: colors.error }]}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: Spacing.sm,
    flexGrow: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  label: {
    ...TextStyles.label,
  },
  asterisk: {
    marginTop: 2,
  },
  pickerWrapper: {
    borderRadius: Radius.md,
    position: 'relative',
  },
  iconOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    ...TextStyles.label,
  },
});
