import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Radius, Spacing } from '@/core/common/constants/theme';
import { Settlement, SettlementStatus } from '@/features/settlements/settlements.interface';
import { GroupMember } from '@/features/groups/groups.interface';
import useGetName from '@/core/common/hooks/use-get-name';
import useProfile from '@/features/user/hooks/use-profile';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

type Props = {
  settlement: Settlement;
  members: GroupMember[];
  onConfirm: (id: string) => void;
  onDispute: (settlement: Settlement) => void;
  isConfirming: boolean;
  onPress?: () => void;
};

const STATUS_CONFIG: Record<
  SettlementStatus,
  { label: string; icon: string; colorKey: 'settled' | 'pending' | 'disputed' }
> = {
  settled: { label: 'Confirmed', icon: 'checkmark-circle', colorKey: 'settled' },
  pending_verification: { label: 'Pending', icon: 'time', colorKey: 'pending' },
  disputed: { label: 'Disputed', icon: 'alert-circle', colorKey: 'disputed' },
};

export default function SettlementCard({
  settlement,
  members,
  onConfirm,
  onDispute,
  isConfirming,
  onPress,
}: Props) {
  const colors = useThemeColors();
  const getName = useGetName();
  const { profile } = useProfile();

  const fromMember = members.find((m) => m.userId === settlement.fromUser) ?? null;
  const toMember = members.find((m) => m.userId === settlement.toUser) ?? null;

  const fromName = fromMember
    ? getName({ id: fromMember.userId, name: fromMember.name })
    : 'Unknown';
  const toName = toMember ? getName({ id: toMember.userId, name: toMember.name }) : 'Unknown';

  const cfg = STATUS_CONFIG[settlement.status];
  const statusColors = colors.status;
  const badgeBg = statusColors[`${cfg.colorKey}Container` as keyof typeof statusColors] as string;
  const badgeFg = statusColors[
    `on${cfg.colorKey.charAt(0).toUpperCase()}${cfg.colorKey.slice(1)}Container` as keyof typeof statusColors
  ] as string;
  const badgeIcon = statusColors[cfg.colorKey] as string;

  const canAct = profile?.id === settlement.toUser && settlement.status === 'pending_verification';

  const amount = settlement.amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border.default }]}
    >
      <Pressable onPress={onPress} disabled={!onPress}>
        {/* ── Header row: avatars + amount ── */}
        <View style={styles.headerRow}>
          <View style={styles.usersRow}>
            <View style={styles.nameBlock}>
              <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>
                {fromName}
                <Text style={[TextStyles.caption, { color: colors.text.disabled }]}> → </Text>
                {toName}
              </Text>
              <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>
                {moment(settlement.createdAt).isValid()
                  ? moment(settlement.createdAt).format('MMM D, YYYY')
                  : '—'}
              </Text>
            </View>
          </View>

          <View style={styles.amountBlock}>
            <Text style={[TextStyles.amountSmall, { color: colors.text.primary }]}>
              {settlement.currency} {amount}
            </Text>
            <View style={[styles.badge, { backgroundColor: badgeBg }]}>
              <Ionicons name={cfg.icon as any} size={11} color={badgeIcon} />
              <Text style={[TextStyles.captionBold, { color: badgeFg }]}>{cfg.label}</Text>
            </View>
          </View>
        </View>

        {/* ── Note ── */}
        {settlement.note ? (
          <Text style={[TextStyles.bodySmall, { color: colors.text.secondary }]} numberOfLines={2}>
            {settlement.note}
          </Text>
        ) : null}

        {/* ── Disputed reason ── */}
        {settlement.status === 'disputed' && settlement.disputedReason ? (
          <View
            style={[styles.disputeReason, { backgroundColor: colors.status.disputedContainer }]}
          >
            <Text style={[TextStyles.captionBold, { color: colors.status.onDisputedContainer }]}>
              Reason: {settlement.disputedReason}
            </Text>
          </View>
        ) : null}
      </Pressable>

      {/* ── Action buttons (payee only, pending_verification) ── */}
      {canAct && (
        <View style={[styles.actionsRow, { borderTopColor: colors.border.subtle }]}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.status.settledContainer }]}
            onPress={() => onConfirm(settlement.id)}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <ActivityIndicator size="small" color={colors.status.settled} />
            ) : (
              <>
                <Ionicons name="checkmark" size={14} color={colors.status.settled} />
                <Text style={[TextStyles.label, { color: colors.status.onSettledContainer }]}>
                  Confirm
                </Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.status.disputedContainer }]}
            onPress={() => onDispute(settlement)}
            disabled={isConfirming}
          >
            <Ionicons name="alert-circle-outline" size={14} color={colors.status.disputed} />
            <Text style={[TextStyles.label, { color: colors.status.onDisputedContainer }]}>
              Dispute
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: Border.thin,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  usersRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  nameBlock: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  amountBlock: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  disputeReason: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: Border.thin,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
});
