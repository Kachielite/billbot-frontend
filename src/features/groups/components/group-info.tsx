import { StyleSheet, Text, TouchableOpacity, View, Image, type ViewStyle } from 'react-native';
import React from 'react';
import { Card, Radius, Spacing } from '@/core/common/constants/theme';
import useGroupBalances from '@/features/balances/hooks/use-group-balances';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import { MemberSummary } from '@/features/balances/balances.interface';
import Ionicons from '@expo/vector-icons/Ionicons';
import SkeletonCard from '@/core/common/components/skeleton-card';
import getInitials from '@/core/common/utils/get-initials';

const AVATAR_SIZE = 45;
const AVATAR_OVERLAP = 12;
const MAX_VISIBLE = 4;

// ── Sub-components ────────────────────────────────────────────────────────────

// Note: we use a full-card skeleton loader (SkeletonCard) instead of a small avatar skeleton
// so the loader better represents the overall card layout.

function MemberAvatars({
  memberSummary,
  colors,
}: {
  memberSummary: MemberSummary[];
  colors: ReturnType<typeof useThemeColors>;
}) {
  const visibleMembers = memberSummary.slice(0, MAX_VISIBLE);
  const overflow = memberSummary.length - MAX_VISIBLE;
  const totalWidth =
    visibleMembers.length * AVATAR_SIZE -
    Math.max(0, visibleMembers.length - 1) * AVATAR_OVERLAP +
    (overflow > 0 ? AVATAR_SIZE - AVATAR_OVERLAP : 0);

  return (
    <View style={[styles.row, { width: totalWidth }]}>
      {visibleMembers.map((member, index) => {
        const swatch = colors.groupColors[index % colors.groupColors.length];
        return (
          <React.Fragment key={member.user.id}>
            {member.user.avatarUrl ? (
              <Image
                source={{ uri: member.user.avatarUrl }}
                style={[
                  styles.avatar,
                  {
                    borderColor: colors.surface,
                    marginLeft: index === 0 ? 0 : -AVATAR_OVERLAP,
                    zIndex: MAX_VISIBLE - index,
                  },
                ]}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: swatch.fill,
                    borderColor: colors.surface,
                    marginLeft: index === 0 ? 0 : -AVATAR_OVERLAP,
                    zIndex: MAX_VISIBLE - index,
                  },
                ]}
              >
                <Text style={[styles.initials, { color: swatch.on }]}>
                  {' '}
                  {getInitials(member.user.name)}
                </Text>
              </View>
            )}
          </React.Fragment>
        );
      })}

      {overflow > 0 && (
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: colors.primaryContainer,
              borderColor: colors.surface,
              marginLeft: -AVATAR_OVERLAP,
              zIndex: 0,
            },
          ]}
        >
          <Text style={[styles.initials, { color: colors.onPrimaryContainer }]}>+{overflow}</Text>
        </View>
      )}
    </View>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function GroupInfo({
  groupId,
  activePools,
}: {
  groupId: string;
  activePools: number;
}) {
  const colors = useThemeColors();
  const { isLoading, memberSummary, balances } = useGroupBalances(groupId);
  // find total owed and total owes across all groups from memberSummary
  const currency = balances[0]?.currency || '$'; // Default to $ if currency is not available
  const totalOwedByMe = memberSummary.reduce((sum, member) => sum + member.totalOwed, 0);
  const totalOwedToMe = memberSummary.reduce((sum, member) => sum + member.totalPaid, 0);
  const netBalance = totalOwedToMe - totalOwedByMe;

  return (
    <View style={[Card as ViewStyle, { backgroundColor: colors.surface }]}>
      <View style={styles.sectionHeader}>
        {isLoading ? (
          <SkeletonCard containerStyle={{ width: '100%' }} tintColor={colors.surface} />
        ) : memberSummary.length === 0 ? (
          <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>No members yet</Text>
        ) : (
          <MemberAvatars memberSummary={memberSummary} colors={colors} />
        )}
        <TouchableOpacity
          style={[styles.inviteButton, { backgroundColor: colors.primaryContainer }]}
        >
          <Ionicons name="add" size={12} color={colors.primary} />
          <Text style={[TextStyles.label, { color: colors.primary }]}>Invite</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.totalBalance}>
        <Text style={[TextStyles.subtitleSmall, { color: colors.text.disabled }]}>
          YOUR NET BALANCE
        </Text>
        <Text
          style={[
            TextStyles.amountLarge,
            { color: netBalance >= 0 ? colors.primary : colors.error },
          ]}
        >
          {currency}{' '}
          {netBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
        <Text style={[TextStyles.label, { color: colors.text.disabled }]}>
          Across {activePools} active {activePools === 1 ? 'tab' : 'tabs'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
  },
  totalBalance: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
});
