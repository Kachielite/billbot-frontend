import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Spacing } from '@/core/common/constants/theme';
import { Settlement } from '@/features/settlements/settlements.interface';
import CustomTextAreaInput from '@/core/common/components/form/custom-text-area-input';
import CustomButton from '@/core/common/components/form/custom-button';
import { Ionicons } from '@expo/vector-icons';
import useDisputeSettlement from '@/features/settlements/hooks/use-dispute-settlement';

type Props = {
  visible: boolean;
  onClose: () => void;
  settlement: Settlement | null;
  poolId: string;
};

export default function DisputeSettlementModal({ visible, onClose, settlement, poolId }: Props) {
  const colors = useThemeColors();
  const { form, isDisputing, disputeSettlement } = useDisputeSettlement(poolId);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!settlement) return;
    await disputeSettlement({ settlementId: settlement.id, data });
    onClose();
  });

  function handleClose() {
    form.reset();
    onClose();
  }

  return (
    <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        {/* ── Header ── */}
        <View style={[styles.header, { borderBottomColor: colors.border.subtle }]}>
          <TouchableOpacity onPress={handleClose} hitSlop={12} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[TextStyles.headingSmall, { color: colors.text.primary }]}>
            DISPUTE SETTLEMENT
          </Text>
          <View style={{ width: 34 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.form}>
            <Text style={[TextStyles.bodySmall, { color: colors.text.secondary }]}>
              Let the payer know why you cannot confirm this payment.
            </Text>

            <CustomTextAreaInput
              id="reason"
              formController={form}
              label="REASON"
              placeholder="Describe why you are disputing this payment…"
              required
              numberOfLines={5}
              maxLength={500}
            />

            <CustomButton
              label={isDisputing ? 'Submitting…' : 'Submit Dispute'}
              onPress={handleSubmit}
              loading={isDisputing}
              disabled={isDisputing}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: Border.thin,
  },
  closeBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
});
