import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Card, Spacing } from '@/core/common/constants/theme';
import { GroupMember } from '@/features/groups/groups.interface';
import CustomDropdown, { DropdownOption } from '@/core/common/components/form/custom-dropdown';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import CustomTextAreaInput from '@/core/common/components/form/custom-text-area-input';
import CustomButton from '@/core/common/components/form/custom-button';
import { Ionicons } from '@expo/vector-icons';
import { type Asset, launchImageLibrary } from 'react-native-image-picker';
import useSubmitSettlement from '@/features/settlements/hooks/use-submit-settlement';
import useProfile from '@/features/user/hooks/use-profile';

type Props = {
  visible: boolean;
  onClose: () => void;
  poolId: string;
  members: GroupMember[];
};

export default function SubmitSettlementModal({ visible, onClose, poolId, members }: Props) {
  const colors = useThemeColors();
  const { profile } = useProfile();
  const { form, isSubmitting, submitSettlement } = useSubmitSettlement(poolId);
  const [proof, setProof] = React.useState<Asset | null>(null);
  const [proofError, setProofError] = React.useState<string | null>(null);

  const otherMembers: DropdownOption<string>[] = members
    .filter((m) => m.userId !== profile?.id)
    .map((m) => ({ label: m.name, value: m.userId }));

  async function pickProof() {
    try {
      const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
      if (res.assets && res.assets.length > 0) {
        setProof(res.assets[0]);
        setProofError(null);
      }
    } catch {
      // ignore
    }
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!proof) {
      setProofError('Proof of payment is required');
      return;
    }
    await submitSettlement({ data, proof });
    setProof(null);
    onClose();
  });

  function handleClose() {
    form.reset();
    setProof(null);
    setProofError(null);
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
          <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>
            Record Settlement
          </Text>
          <View style={{ width: 34 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.form}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <CustomDropdown
              id="toUserId"
              formController={form}
              label="PAID TO"
              placeholder="Select member"
              required
              options={otherMembers}
            />

            <CustomTextInput
              id="amount"
              formController={form}
              label="AMOUNT"
              placeholder="0.00"
              required
              type="number"
            />

            <CustomTextAreaInput
              id="note"
              formController={form}
              label="NOTE"
              placeholder="Add a note (optional)"
              numberOfLines={3}
              maxLength={500}
            />

            {/* ── Proof picker ── */}
            <View style={styles.proofSection}>
              <Text style={[TextStyles.label, { color: colors.text.primary }]}>
                PROOF OF PAYMENT <Text style={{ color: colors.primary }}>*</Text>
              </Text>
              <TouchableOpacity
                onPress={pickProof}
                activeOpacity={0.8}
                style={[
                  styles.proofPicker,
                  Card as any,
                  {
                    backgroundColor: colors.surface,
                    borderColor: proofError ? colors.error : colors.border.default,
                  },
                ]}
              >
                {proof?.uri ? (
                  <Image
                    source={{ uri: proof.uri }}
                    style={styles.proofPreview}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.proofPlaceholder}>
                    <Ionicons name="image-outline" size={28} color={colors.text.disabled} />
                    <Text style={[TextStyles.label, { color: colors.text.disabled }]}>
                      Tap to attach proof
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              {proofError && (
                <Text style={[TextStyles.error, { color: colors.error }]}>{proofError}</Text>
              )}
            </View>

            <CustomButton
              label={isSubmitting ? 'Submitting…' : 'Submit Payment'}
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </ScrollView>
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
    paddingBottom: Spacing.xxl,
  },
  proofSection: {
    gap: Spacing.sm,
  },
  proofPicker: {
    height: 160,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  proofPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  proofPreview: {
    width: '100%',
    height: '100%',
  },
});
