import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import CustomFormSheet from '@/core/common/components/layout/custom-formsheet';
import CustomTextAreaInput from '@/core/common/components/form/custom-text-area-input';
import CustomButton from '@/core/common/components/form/custom-button';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import useDisputeSettlement from '@/features/settlements/hooks/use-dispute-settlement';

type Props = StaticScreenProps<{ settlementId: string; poolId: string }>;

export default function DisputeSettlementScreen({ route }: Props) {
  const { settlementId, poolId } = route.params;
  const colors = useThemeColors();
  const navigation = useNavigation();
  const { form, isDisputing, disputeSettlement } = useDisputeSettlement(poolId);

  const handleSubmit = form.handleSubmit(async (data) => {
    await disputeSettlement({ settlementId, data });
    navigation.goBack();
  });

  return (
    <CustomFormSheet>
      <View style={styles.header}>
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Dispute Payment</Text>
        <View style={[styles.iconWrap, { backgroundColor: colors.status.disputedContainer }]}>
          <Ionicons name="alert-circle-outline" size={20} color={colors.status.disputed} />
        </View>
      </View>

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
        label="Submit Dispute"
        onPress={handleSubmit}
        loading={isDisputing}
        disabled={isDisputing}
      />
    </CustomFormSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
