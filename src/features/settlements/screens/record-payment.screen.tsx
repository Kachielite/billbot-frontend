import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import CustomFormSheet from '@/core/common/components/layout/custom-formsheet';
import { TextStyles } from '@/core/common/constants/fonts';
import { Radius, Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { type Asset, launchImageLibrary } from 'react-native-image-picker';
import CustomDropdown, { DropdownOption } from '@/core/common/components/form/custom-dropdown';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import CustomTextAreaInput from '@/core/common/components/form/custom-text-area-input';
import CustomButton from '@/core/common/components/form/custom-button';
import useSubmitSettlement from '@/features/settlements/hooks/use-submit-settlement';
import usePoolDetail from '@/features/pools/hooks/use-pool-detail';
import useGroupDetail from '@/features/groups/hooks/use-group-detail';
import useProfile from '@/features/user/hooks/use-profile';

type Props = StaticScreenProps<{ poolId: string; toUserId?: string; amount?: number }>;

export default function RecordPaymentScreen({ route }: Props) {
  const { poolId, toUserId: prefillToUserId, amount: prefillAmount } = route.params;
  const navigation = useNavigation();
  const colors = useThemeColors();
  const { profile } = useProfile();

  const { pool } = usePoolDetail(poolId);
  const { group } = useGroupDetail(pool?.groupId ?? '');
  const members = group?.members ?? [];

  const { form, isSubmitting, submitSettlement } = useSubmitSettlement(poolId);
  const [proof, setProof] = React.useState<Asset | null>(null);
  const [proofError, setProofError] = React.useState<string | null>(null);

  const otherMembers: DropdownOption<string>[] = members
    .filter((m) => m.userId !== profile?.id)
    .map((m) => ({ label: m.name, value: m.userId }));

  React.useEffect(() => {
    if (prefillToUserId) form.setValue('toUserId', prefillToUserId, { shouldValidate: false });
    if (prefillAmount != null) form.setValue('amount', prefillAmount, { shouldValidate: false });
  }, [prefillToUserId, prefillAmount]);

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
    if (navigation.canGoBack()) navigation.goBack();
  });

  return (
    <CustomFormSheet>
      <View style={styles.container}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text
            style={[
              TextStyles.headingSmall,
              { color: colors.text.primary, textTransform: 'uppercase' },
            ]}
          >
            RECORD PAYMENT
          </Text>
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.surface }]}
            onPress={() => navigation.canGoBack() && navigation.goBack()}
          >
            <Ionicons name="close" size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* ── Form fields ── */}
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
              {
                backgroundColor: colors.surface,
                borderColor: proofError ? colors.error : colors.border.default,
                borderWidth: 1,
                borderRadius: Radius.md,
              },
            ]}
          >
            {proof?.uri ? (
              <Image source={{ uri: proof.uri }} style={styles.proofPreview} resizeMode="cover" />
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
          label="Submit Payment"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </View>
    </CustomFormSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proofSection: {
    gap: Spacing.sm,
  },
  proofPicker: {
    height: 140,
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
