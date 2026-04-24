import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';

export interface ConfirmDeleteModalProps {
  /** Controls modal visibility */
  visible: boolean;
  /** Bold title line, e.g. "Remove Alice?" */
  title: string;
  /** Supporting message shown below the title */
  message?: string;
  /** Label for the destructive confirm button (default: "Delete") */
  confirmLabel?: string;
  /** Label for the cancel button (default: "Cancel") */
  cancelLabel?: string;
  /** Ionicons name shown in the icon circle (default: "trash-outline") */
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  /** Whether the confirm action is in progress */
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  visible,
  title,
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  icon = 'trash-outline',
  isLoading = false,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const colors = useThemeColors();

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={[styles.grabber, { backgroundColor: colors.border.default }]} />

          {/* icon circle */}
          <View style={[styles.iconWrap, { backgroundColor: colors.errorContainer ?? '#fde8e8' }]}>
            <Ionicons name={icon} size={28} color={colors.error} />
          </View>

          {/* copy */}
          <Text
            style={[TextStyles.headingSmall, { color: colors.text.primary, textAlign: 'center' }]}
          >
            {title}
          </Text>
          <Text style={[TextStyles.body, { color: colors.text.secondary, textAlign: 'center' }]}>
            {message}
          </Text>

          {/* actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.btn, { backgroundColor: colors.surface }]}
            >
              <Text style={[TextStyles.button, { color: colors.text.primary }]}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              disabled={isLoading}
              style={[styles.btn, { backgroundColor: colors.error }, isLoading && { opacity: 0.5 }]}
            >
              <Text style={[TextStyles.button, { color: '#fff' }]}>
                {isLoading ? 'Please wait…' : confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadow.md,
  },
  grabber: {
    width: 44,
    height: 4,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
    width: '100%',
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
});
