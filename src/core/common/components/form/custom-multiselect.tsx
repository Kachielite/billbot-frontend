import React, { useEffect, useRef, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Foundation, MaterialIcons } from '@expo/vector-icons';
import { MultiSelect } from 'react-native-element-dropdown';
import type { IMultiSelectRef } from 'react-native-element-dropdown/lib/typescript/components/MultiSelect/model';
import { Border, Input, Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';

export interface MultiSelectOption<T = string | number> {
  label: string;
  value: T;
}

interface Props<T extends FieldValues, V = string | number> {
  id: Path<T>;
  formController: UseFormReturn<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options: MultiSelectOption<V>[];
}

export default function CustomMultiSelect<T extends FieldValues, V = string | number>({
  id,
  formController,
  label,
  required,
  placeholder,
  options,
}: Props<T, V>) {
  const colors = useThemeColors();
  const [, setIsFocus] = useState(false);
  const multiSelectRef = useRef<IMultiSelectRef | null>(null);

  const {
    formState: { errors },
  } = formController;
  const errorMessage = errors[id]?.message as string | undefined;

  const currentValues = (formController.watch(id) as unknown as V[] | undefined) ?? [];

  // Enable LayoutAnimation on Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  // Animate when an item is removed (length decreases)
  const prevCountRef = useRef<number>(currentValues.length);
  useEffect(() => {
    if (prevCountRef.current > currentValues.length) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    prevCountRef.current = currentValues.length;
  }, [currentValues.length]);

  const labelColor = errorMessage ? colors.error : colors.text.primary;
  const inputBorderColor = errorMessage ? colors.error : colors.border.strong;

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
        {required && (
          <Foundation style={styles.asterisk} name="asterisk" size={10} color={labelColor} />
        )}
      </View>

      <MultiSelect
        ref={multiSelectRef as any}
        style={[styles.dropdown, { borderColor: inputBorderColor }]}
        placeholderStyle={[styles.placeholderStyle, { color: colors.text.inverse }]}
        selectedTextStyle={[styles.selectedTextStyle, { color: colors.text.primary }]}
        itemTextStyle={[styles.itemText, { color: colors.text.primary }]}
        itemContainerStyle={{ backgroundColor: colors.primaryContainer }}
        data={options}
        labelField="label"
        valueField="value"
        placeholder={placeholder ?? 'Select tags'}
        value={currentValues as any}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(selected: string[]) => {
          formController.setValue(id as any, selected as any, { shouldValidate: true });
          // Close the dropdown after selection using the imperative ref
          try {
            multiSelectRef.current?.close();
          } catch {
            // fallback to toggling focus boolean
            setIsFocus(false);
          }
        }}
        activeColor="transparent"
        renderItem={(item: MultiSelectOption<V>, selected?: boolean) => (
          <View
            style={[
              styles.dropdownItem,
              { backgroundColor: colors.onSecondaryContainer, borderWidth: 0 },
            ]}
          >
            <Text style={[styles.dropdownItemText, { color: colors.text.primary }]}>
              {item.label}
            </Text>
            {selected && <MaterialIcons name="check" size={16} color={colors.primary} />}
          </View>
        )}
        renderSelectedItem={(selected: { label?: string; value?: V }, unSelect) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              // Remove the selected value directly via formController (reliable across lib versions)
              const itemValue = (selected as any).value;
              const newValues = currentValues.filter((v) => v !== itemValue);
              // animate removal
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              formController.setValue(id as any, newValues as any, { shouldValidate: true });
              unSelect && unSelect(selected);
            }}
            style={[
              styles.selectedChip,
              {
                backgroundColor: colors.onSecondaryContainer,
                borderColor: colors.border.strong,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${String(selected.label ?? selected.value)}`}
          >
            <Text
              style={[
                styles.selectedChipText,
                { color: colors.text.primary, marginRight: Spacing.xs },
              ]}
            >
              {String(selected.label ?? selected.value)}
            </Text>
            {/*<MaterialIcons name="close" size={12} color={colors.text.primary} />*/}
          </TouchableOpacity>
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
  itemText: {
    ...TextStyles.bodySmall,
  },
  error: {
    ...TextStyles.label,
  },
  selectedChip: {
    borderWidth: Border.hairline,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginRight: Spacing.xs,
    marginTop: Spacing.xs,
  },
  selectedChipText: {
    ...TextStyles.body,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  dropdownItemText: {
    ...TextStyles.bodySmall,
    flex: 1,
    borderWidth: 0,
  },
});
