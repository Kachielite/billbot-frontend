import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import moment from 'moment/moment';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Border, Input, Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';

interface Props<T extends FieldValues> {
  id: Path<T>;
  formController: UseFormReturn<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export default function CustomDatePicker<T extends FieldValues>({
  id,
  formController,
  label,
  required,
  placeholder,
}: Props<T>) {
  const colors = useThemeColors();
  const [show, setShow] = React.useState(false);
  const [pickerMode, setPickerMode] = React.useState<'date' | 'time'>('date');

  // Form controller integration
  const {
    formState: { errors },
  } = formController;
  const errorMessage = errors[id]?.message as string | undefined;

  // base date value for the field
  const baseDate = formController.watch(id)
    ? new Date(formController.watch(id) as any)
    : new Date();

  const onChange = (event: DateTimePickerEvent, selected?: Date) => {
    const { type } = event;
    const timestamp = (event.nativeEvent as any)?.timestamp;
    if (type === 'set') {
      const picked = selected ?? (timestamp ? new Date(timestamp) : undefined);
      if (picked) {
        // Merge picked part (date or time) into the baseDate
        const next = new Date(baseDate);
        if (pickerMode === 'date') {
          next.setFullYear(picked.getFullYear(), picked.getMonth(), picked.getDate());
        } else {
          next.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
        }
        formController.setValue(id as any, next.toISOString() as any);
      }
    }
    setShow(false);
  };

  const labelColor = errorMessage ? colors.error : colors.text.primary;
  const asteriskColor = errorMessage ? colors.error : colors.text.primary;
  const inputBorderColor = errorMessage ? colors.error : colors.border.default;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
          {required && (
            <Foundation style={styles.asterisk} name="asterisk" size={10} color={asteriskColor} />
          )}
        </View>
      </View>

      {/* Two fields in a row: Date and Time */}
      <View style={styles.row}>
        <Pressable
          style={[styles.inputHalf, { borderColor: inputBorderColor }]}
          onPress={() => {
            setPickerMode('date');
            setShow(true);
          }}
        >
          <Text style={{ color: colors.text.primary }}>
            {moment(baseDate).format('DD/MM/YYYY')}
          </Text>
          <Ionicons name="calendar-clear" size={20} color={colors.text.primary} />
        </Pressable>

        <Pressable
          style={[styles.inputHalf, { borderColor: inputBorderColor }]}
          onPress={() => {
            setPickerMode('time');
            setShow(true);
          }}
        >
          <Text style={{ color: colors.text.primary }}>{moment(baseDate).format('hh:mm')}</Text>
          <MaterialCommunityIcons name="clock-time-two" size={24} color={colors.text.primary} />
        </Pressable>
      </View>

      {show && (
        <Modal transparent animationType="fade" onRequestClose={() => setShow(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setShow(false)}>
            <TouchableWithoutFeedback>
              <View style={[styles.pickerContainer, { backgroundColor: colors.text.primary }]}>
                <RNDateTimePicker
                  placeholderText="Enter date"
                  value={baseDate}
                  onChange={onChange}
                  mode={pickerMode}
                  is24Hour={false}
                  display={
                    Platform.OS === 'ios'
                      ? pickerMode === 'time'
                        ? 'spinner'
                        : 'inline'
                      : 'default'
                  }
                />
              </View>
            </TouchableWithoutFeedback>
          </Pressable>
        </Modal>
      )}

      {errorMessage && <Text style={[styles.error, { color: colors.error }]}>{errorMessage}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  inputHalf: {
    ...Input,
    borderWidth: Border.thin,
    borderRadius: Radius.md,
    width: '48%',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    ...TextStyles.bodyMedium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerContainer: {
    borderRadius: 12,
    padding: 8,
    minWidth: 280,
    overflow: 'hidden',
  },
  error: {
    ...TextStyles.error,
  },
});
