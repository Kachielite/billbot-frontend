import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Foundation } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { Border, Input, Radius, Spacing } from '@/core/common/constants/theme';
import { Fonts, TextStyles } from '@/core/common/constants/fonts';

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
}

export default function CustomDropdown<T extends FieldValues, V = string | number>({
  id,
  formController,
  label,
  required,
  placeholder,
  options,
}: Props<T, V>) {
  const colors = useThemeColors();

  const {
    formState: { errors },
  } = formController;
  const errorMessage = errors[id]?.message as string | undefined;

  const currentValue = formController.watch(id) as unknown as V | undefined;

  const labelColor = errorMessage ? colors.error : colors.text.primary;
  const inputBorderColor = errorMessage ? colors.error : colors.border.default;

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
        {required && (
          <Foundation style={styles.asterisk} name="asterisk" size={10} color={labelColor} />
        )}
      </View>

      <Dropdown
        style={[
          styles.dropdown,
          { borderColor: inputBorderColor, backgroundColor: colors.surface },
        ]}
        placeholderStyle={[styles.placeholderStyle, { color: colors.text.inverse }]}
        selectedTextStyle={[styles.selectedTextStyle, { color: colors.text.primary }]}
        itemTextStyle={[styles.itemText, { color: colors.text.primary }]}
        itemContainerStyle={{ backgroundColor: colors.primaryContainer }}
        activeColor={colors.secondary}
        data={options}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={currentValue as any}
        onChange={(item: DropdownOption<V>) => {
          formController.setValue(id as any, item.value as any, { shouldValidate: true });
        }}
        fontFamily={Fonts.regular}
        keyboardAvoiding
      />

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
  dropdown: {
    ...Input,
    borderWidth: Border.thin,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  placeholderStyle: {
    ...TextStyles.bodySmall,
  },
  selectedTextStyle: {
    ...TextStyles.bodySmall,
  },
  inputSearchStyle: {
    ...TextStyles.bodySmall,
    height: 40,
  },
  itemContainer: {
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  optionText: {
    ...TextStyles.bodySmall,
  },
  error: {
    ...TextStyles.label,
  },
  itemText: {
    ...TextStyles.bodySmall,
  },
});
