import { KeyboardAvoidingView, Modal, StyleSheet, View } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Shadow, Spacing } from '@/core/common/constants/theme';

type BottomModalProps = {
  visible: boolean;
  onCancel: () => void;
  children: React.ReactNode;
};

export default function BottomModal({ visible, onCancel, children }: BottomModalProps) {
  const colors = useThemeColors();
  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onCancel}>
      <KeyboardAvoidingView style={styles.backdrop} behavior="padding">
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>{children}</View>
      </KeyboardAvoidingView>
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
});
