import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Foundation } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { Border, Input, Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';

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
  dropdownPosition?: 'auto' | 'top' | 'bottom';
}

export default function CustomDropdown<T extends FieldValues, V = string | number>({
  id,
  formController,
  label,
  required,
  placeholder,
  options,
  disabled = false,
  dropdownPosition = 'auto',
}: Props<T, V>) {
  const colors = useThemeColors();
  const [open, setOpen] = React.useState(false);
  const items = React.useMemo(
    () => options.map((option) => ({ label: option.label, value: option.value as any })),
    [options],
  );

  const {
    formState: { errors },
  } = formController;
  const errorMessage = errors[id]?.message as string | undefined;

  const currentValue = formController.watch(id) as unknown as V | undefined;
  const setPickerItems = React.useCallback(() => {
    // no-op: options are controlled via props
  }, []);

  const setPickerValue = React.useCallback(
    (valueOrUpdater: any) => {
      const nextValue =
        typeof valueOrUpdater === 'function'
          ? valueOrUpdater((currentValue ?? null) as any)
          : valueOrUpdater;

      formController.setValue(id as any, (nextValue ?? undefined) as any, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [currentValue, formController, id],
  );

  const labelColor = errorMessage ? colors.error : colors.text.primary;
  const inputBorderColor = errorMessage
    ? colors.error
    : disabled
      ? colors.border.subtle
      : colors.border.default;

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
        {required && (
          <Foundation style={styles.asterisk} name="asterisk" size={10} color={labelColor} />
        )}
      </View>

      <DropDownPicker
        open={open}
        value={(currentValue ?? null) as any}
        items={items}
        setOpen={setOpen}
        setItems={setPickerItems as any}
        setValue={setPickerValue as any}
        placeholder={placeholder}
        disabled={disabled}
        dropDownDirection={
          dropdownPosition === 'top' ? 'TOP' : dropdownPosition === 'bottom' ? 'BOTTOM' : 'AUTO'
        }
        style={[
          styles.dropdown,
          { borderColor: inputBorderColor, backgroundColor: colors.surface },
          disabled && { opacity: 0.6 },
        ]}
        dropDownContainerStyle={[
          styles.dropdownContainer,
          { borderColor: colors.border.default, backgroundColor: colors.surface },
        ]}
        listItemContainerStyle={{ backgroundColor: colors.surface }}
        listItemLabelStyle={[styles.itemText, { color: colors.text.primary }]}
        selectedItemContainerStyle={{ backgroundColor: colors.primaryContainer }}
        selectedItemLabelStyle={{ color: colors.primary }}
        textStyle={[styles.selectedTextStyle, { color: colors.text.primary }]}
        placeholderStyle={[styles.placeholderStyle, { color: colors.text.inverse }]}
        // TS: these style props are ViewStyle; tintColor is not valid there.
        // Keep default icons to avoid invalid style typing.
        zIndex={3000}
        zIndexInverse={1000}
        listMode="SCROLLVIEW"
        maxHeight={280}
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
    minHeight: 48,
  },
  dropdownContainer: {
    borderWidth: Border.thin,
    borderRadius: Radius.md,
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
