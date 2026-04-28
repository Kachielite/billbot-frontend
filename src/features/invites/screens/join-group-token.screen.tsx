import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Toast } from 'toastify-react-native';
import CustomFormSheet from '@/core/common/components/layout/custom-formsheet';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import useGroupDetail from '@/features/groups/hooks/use-group-detail';
import useJoinByToken from '../hooks/use-join-by-token';
import { AppError } from '@/core/common/error';

type Props = StaticScreenProps<{
  token: string;
  groupId: string;
}>;

export default function JoinGroupTokenScreen({ route }: Props) {
  const { token, groupId } = route.params;
  const colors = useThemeColors();
  const nav = useNavigation() as any;

  const { group, isLoading: isLoadingGroup } = useGroupDetail(groupId);
  const { joinByToken, isJoining, getErrorMessage } = useJoinByToken();

  const handleAccept = async () => {
    try {
      await joinByToken(token);
      Toast.success('You joined the group!');
      nav.navigate('Group', { groupId });
    } catch (err) {
      Toast.error(getErrorMessage(err as AppError));
      nav.goBack();
    }
  };

  const groupEmoji = group?.emoji ?? '👥';
  const groupName = group?.name ?? '—';

  return (
    <CustomFormSheet>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Group Invite</Text>
        <View style={[styles.iconWrap, { backgroundColor: colors.primaryContainer }]}>
          <Ionicons name="mail-open-outline" size={20} color={colors.primary} />
        </View>
      </View>

      <Text style={[TextStyles.bodySmall, { color: colors.text.secondary }]}>
        You have been invited to join a group. Accept to start splitting expenses together.
      </Text>

      {/* Group card */}
      <View
        style={[
          styles.groupCard,
          { backgroundColor: colors.surface, borderColor: colors.border.default },
        ]}
      >
        {isLoadingGroup ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <View style={styles.groupRow}>
            <View style={[styles.emojiWrap, { backgroundColor: colors.primaryContainer }]}>
              <Text style={styles.emoji}>{groupEmoji}</Text>
            </View>
            <View>
              <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>
                {groupName}
              </Text>
              {group?.memberCount != null && (
                <Text style={[TextStyles.caption, { color: colors.text.secondary }]}>
                  {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={[
          styles.acceptBtn,
          { backgroundColor: colors.primary },
          isJoining && { opacity: 0.7 },
        ]}
        onPress={handleAccept}
        disabled={isJoining || isLoadingGroup}
      >
        {isJoining ? (
          <ActivityIndicator size="small" color={colors.onPrimary} />
        ) : (
          <>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.onPrimary} />
            <Text style={[TextStyles.label, { color: colors.onPrimary }]}>Accept Invite</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.declineBtn} onPress={() => nav.goBack()} disabled={isJoining}>
        <Text style={[TextStyles.label, { color: colors.text.secondary }]}>Decline</Text>
      </TouchableOpacity>
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
  groupCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emojiWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
  },
  declineBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
});
