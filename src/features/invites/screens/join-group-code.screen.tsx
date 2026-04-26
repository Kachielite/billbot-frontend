import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomFormSheet from '@/core/common/components/layout/custom-formsheet';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import CustomButton from '@/core/common/components/form/custom-button';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import { Spacing } from '@/core/common/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import useJoinByCode from '../hooks/use-join-by-code';

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
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Join a Group</Text>
        <View style={[styles.iconWrap, { backgroundColor: colors.primaryContainer }]}>
          <Ionicons name="people-outline" size={20} color={colors.primary} />
        </View>
      </View>

      <Text style={[TextStyles.bodySmall, { color: colors.text.secondary }]}>
        Enter the invite code you received via email to join an existing group.
      </Text>

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
});
