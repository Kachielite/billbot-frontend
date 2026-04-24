import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  type ViewStyle,
  useColorScheme,
} from 'react-native';
import React from 'react';
import { Card, Radius, Spacing } from '@/core/common/constants/theme';
import useGroupBalances from '@/features/balances/hooks/use-group-balances';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import { MemberSummary } from '@/features/balances/balances.interface';
import Ionicons from '@expo/vector-icons/Ionicons';
import SkeletonCard from '@/core/common/components/skeleton-card';
import getInitials from '@/core/common/utils/get-initials';
import Tooltip from '@/core/common/components/tooltip';
import { GroupDetail } from '@/features/groups/groups.interface';
import useUserStore from '@/features/user/user.state';

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
const DEFAULT_EMOJI_BG = '#9370DB';

export default function GroupInfo({ group }: { group: GroupDetail }) {
  const scheme = useColorScheme();
  const colors = useThemeColors();
  const { user } = useUserStore();
  const { isLoading, memberSummary, balances } = useGroupBalances(group.id);
  // find total owed and total owes across the group using unsettled balances
  const currency = balances?.[0]?.currency || '$'; // Default to $ if currency is not available

  // Rules:
  // - totalOwedByMe: splits where user is the debtor (from.id === user.id), paidBy !== user.id, unsettled
  // - totalOwedToMe: splits where user is the creditor (to.id === user.id), paidBy !== user.id, unsettled
  const userId = user?.id;
  let totalOwedByMe = 0;
  let totalOwedToMe = 0;

  if (userId && Array.isArray(balances)) {
    balances.forEach((b) => {
      // ensure amount is positive and entries are between distinct users
      const amt = Math.abs(b.amount ?? 0);
      const fromId = b.from?.id;
      const toId = b.to?.id;

      if (fromId === userId && toId && toId !== userId) {
        // user owes someone
        totalOwedByMe += amt;
      } else if (toId === userId && fromId && fromId !== userId) {
        // someone owes user
        totalOwedToMe += amt;
      }
    });
  }

  const netBalance = totalOwedToMe - totalOwedByMe;

  // measure amounts so both stat boxes can grow to the same width
  const [owedToMeWidth, setOwedToMeWidth] = React.useState(0);
  const [owedByMeWidth, setOwedByMeWidth] = React.useState(0);
  // also measure title widths so titles are never truncated
  const [owedToMeTitleWidth, setOwedToMeTitleWidth] = React.useState(0);
  const [owedByMeTitleWidth, setOwedByMeTitleWidth] = React.useState(0);
  const statContentPadding = Spacing.sm * 2;
  const statBoxWidth = Math.max(
    owedToMeWidth,
    owedByMeWidth,
    owedToMeTitleWidth,
    owedByMeTitleWidth,
  )
    ? Math.max(owedToMeWidth, owedByMeWidth, owedToMeTitleWidth, owedByMeTitleWidth) +
      statContentPadding
    : undefined;

  const bgColor = group.color ?? DEFAULT_EMOJI_BG;
  const iconBackgroundOpacity = scheme === 'dark' ? '80' : '40';

  return (
    <View style={[{ gap: Spacing.xl }]}>
      <View
        style={[
          Card as ViewStyle,
          styles.sectionHeader,
          { backgroundColor: colors.surface, borderColor: colors.border.subtle },
        ]}
      >
        <View style={[styles.row, { gap: Spacing.sm }]}>
          <View
            style={[styles.emojiContainer, { backgroundColor: bgColor + iconBackgroundOpacity }]}
          >
            <Text style={styles.emoji}>{group.emoji ?? '👥'}</Text>
          </View>
          <View>
            <Text style={[TextStyles.headingSmall, { color: colors.text.primary }]}>
              {group.name ?? 'Group Name'}
            </Text>
            {group.description && (
              <Text style={[TextStyles.caption, { color: colors.text.secondary }]}>
                {group.description}
              </Text>
            )}
          </View>
        </View>
        <View style={[styles.inviteButton, { backgroundColor: colors.primaryContainer }]}>
          <Text style={[TextStyles.caption, { color: colors.primary }]}>
            {group.memberCount > 0
              ? `${group.memberCount} ${group.memberCount === 1 ? 'member' : 'members'}`
              : 'No members yet'}
          </Text>
        </View>
      </View>
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md }}>
          <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Balances</Text>
          <Tooltip description="Summary of unsettled amounts across active tabs in this group." />
        </View>

        <View
          style={[
            Card as ViewStyle,
            styles.totalBalance,
            { backgroundColor: colors.surface, borderColor: colors.border.subtle },
          ]}
        >
          <View style={styles.balanceRow}>
            <View style={styles.netColumn}>
              <Text
                style={[
                  TextStyles.label,
                  { color: colors.text.disabled, marginBottom: Spacing.xs },
                ]}
              >
                {netBalance > 0
                  ? 'Amount owed to you'
                  : netBalance < 0
                    ? 'Amount you owe'
                    : 'All settled up'}{' '}
                across {group.activePoolCount} active {group.activePoolCount === 1 ? 'tab' : 'tabs'}
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
            </View>
          </View>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    gap: Spacing.md,
  },
  netColumn: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  sideStats: {
    minWidth: 160,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginLeft: 'auto',
  },
  statBox: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    alignItems: 'flex-end',
  },
  statLabel: {
    fontSize: 12,
  },
  statAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  emojiContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
  },
});
