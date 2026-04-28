import React, { useState } from 'react';
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
  zIndex?: number;
  zIndexInverse?: number;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CustomDropdown<T extends FieldValues, V = string | number>({
  id,
  formController,
  label,
  required,
  placeholder,
  options,
  disabled = false,
  zIndex = 5000,
  zIndexInverse = 1000,
  open: controlledOpen,
  setOpen: controlledSetOpen,
}: Props<T, V>) {
  const colors = useThemeColors();
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : localOpen;
  const setIsOpen = controlledSetOpen ?? setLocalOpen;
  const [items, setItems] = useState(() =>
    options.map((o) => ({ label: o.label, value: o.value as any })),
  );

  React.useEffect(() => {
    setItems(options.map((o) => ({ label: o.label, value: o.value as any })));
  }, [options]);

  const {
    formState: { errors },
  } = formController;
  const errorMessage = errors[id]?.message as string | undefined;
  const currentValue = (formController.watch(id) as unknown as V) ?? null;

  const labelColor = errorMessage ? colors.error : colors.text.primary;
  const borderColor = errorMessage
    ? colors.error
    : isOpen
      ? colors.primary
      : disabled
        ? colors.border.subtle
        : colors.border.default;

  return (
    <View style={[styles.container, { zIndex }]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
          {required && (
            <Foundation style={styles.asterisk} name="asterisk" size={10} color={labelColor} />
          )}
        </View>
      )}

      <DropDownPicker
        open={isOpen}
        value={currentValue as any}
        items={items}
        setOpen={setIsOpen}
        setItems={setItems}
        setValue={(valueOrFn: any) => {
          const next =
            typeof valueOrFn === 'function' ? valueOrFn(currentValue ?? null) : valueOrFn;
          formController.setValue(id as any, (next ?? undefined) as any, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }}
        placeholder={placeholder ?? 'Select an option'}
        disabled={disabled}
        dropDownDirection="AUTO"
        style={[
          styles.dropdown,
          {
            borderColor,
            borderWidth: isOpen ? 2 : Border.thin,
            backgroundColor: colors.surface,
          },
          isOpen &&
            !disabled && {
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 4,
            },
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
        tickIconStyle={{ tintColor: colors.text.primary } as any}
        textStyle={[styles.selectedTextStyle, { color: colors.text.primary }]}
        placeholderStyle={[styles.placeholderStyle, { color: colors.text.disabled }]}
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
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
  itemText: {
    ...TextStyles.bodySmall,
  },
  error: {
    ...TextStyles.label,
  },
});
