import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomFormSheet from '@/core/common/components/layout/custom-formsheet';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import CustomButton from '@/core/common/components/form/custom-button';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import useJoinByCode from '../hooks/use-join-by-code';
import { Radius, Shadow } from '@/core/common/constants/theme';
import InfoBox from '@/core/common/components/info-box';

export default function JoinGroupCodeScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const { form, isJoining, joinByCode } = useJoinByCode();

  const handleSubmit = form.handleSubmit(async (data) => {
    await joinByCode(data);
    navigation.goBack();
  });

  return (
    <CustomFormSheet>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>JOIN A GROUP</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="close" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <InfoBox
        title="How do I find my invite code?"
        description="Get the invite code from the email sent to you from BillBot, or ask them to share it with you directly from the app."
      />

      <CustomTextInput
        id="code"
        formController={form}
        label="INVITE CODE"
        placeholder="e.g. TUNDE-4821"
        required
        hint="Invite codes are case-insensitive"
      />

      <CustomButton
        label="Join Group"
        onPress={handleSubmit}
        loading={isJoining}
        disabled={isJoining}
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
});
