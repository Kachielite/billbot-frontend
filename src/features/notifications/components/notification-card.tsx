import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import moment from 'moment';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Ionicons } from '@expo/vector-icons';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import { Notification, NotificationType } from '../notifications.interface';

type Props = {
  notification: Notification;
  isLast?: boolean;
  onPress?: () => void;
  onAcceptInvite?: () => void;
};

// ── Type config ───────────────────────────────────────────────────────────────

type TypeConfig = { emoji: string; color: string };

const TYPE_CONFIG: Record<string, TypeConfig> = {
  'invite.received': { emoji: '✉️', color: 'rgba(99,102,241,0.14)' },
  'expense.created': { emoji: '💸', color: 'rgba(249,115,22,0.14)' },
  'expense.deleted': { emoji: '🗑️', color: 'rgba(107,114,128,0.14)' },
  'upcoming.expense': { emoji: '📅', color: 'rgba(59,130,246,0.14)' },
  'settlement.submitted': { emoji: '💳', color: 'rgba(168,85,247,0.14)' },
  'settlement.confirmed': { emoji: '✅', color: 'rgba(34,197,94,0.14)' },
  'settlement.disputed': { emoji: '⚠️', color: 'rgba(239,68,68,0.14)' },
  'member.joined': { emoji: '🎉', color: 'rgba(234,179,8,0.14)' },
  'member.removed': { emoji: '👋', color: 'rgba(107,114,128,0.14)' },
  'pool.created': { emoji: '🗂️', color: 'rgba(20,184,166,0.14)' },
  'pool.settled': { emoji: '🏁', color: 'rgba(34,197,94,0.14)' },
};

const DEFAULT_CONFIG: TypeConfig = { emoji: '🔔', color: 'rgba(107,114,128,0.14)' };

const NAVIGABLE_TYPES = new Set([
  'expense.created',
  'upcoming.expense',
  'settlement.submitted',
  'settlement.confirmed',
  'settlement.disputed',
  'pool.created',
  'pool.settled',
  'invite.received',
  'member.joined',
  'member.removed',
]);

function getConfig(type: NotificationType): TypeConfig {
  return TYPE_CONFIG[type] ?? DEFAULT_CONFIG;
}

// ── Action CTA derived from metadata.action ───────────────────────────────────

type ActionCta = {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  variant: 'confirm' | 'dispute';
};

function getActionCta(notification: Notification): ActionCta | null {
  const action = (notification.metadata as Record<string, any>).action;
  if (action === 'confirm_settlement')
    return { label: 'Confirm Payment', iconName: 'checkmark-circle-outline', variant: 'confirm' };
  if (action === 'view_dispute')
    return { label: 'View Dispute', iconName: 'alert-circle-outline', variant: 'dispute' };
  return null;
}

// ── Time label ────────────────────────────────────────────────────────────────

function getTimeLabel(date: Date): string {
  const m = moment(date);
  const now = moment();
  const diffMins = now.diff(m, 'minutes');
  const diffHours = now.diff(m, 'hours');
  const diffDays = now.diff(m, 'days');

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return m.format('h:mm A');
  return m.format('MMM D');
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NotificationCard({
  notification,
  isLast = false,
  onPress,
  onAcceptInvite,
}: Props) {
  const colors = useThemeColors();
  const { emoji, color } = getConfig(notification.type);
  const timeLabel = getTimeLabel(notification.createdAt);
  const isNavigable = NAVIGABLE_TYPES.has(notification.type);
  const isInvite = notification.type === 'invite.received';
  const actionCta = getActionCta(notification);

  const ctaBg =
    actionCta?.variant === 'confirm'
      ? colors.status.settledContainer
      : colors.status.disputedContainer;
  const ctaFg =
    actionCta?.variant === 'confirm'
      ? colors.status.onSettledContainer
      : colors.status.onDisputedContainer;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.row,
        !notification.isRead && { backgroundColor: colors.primaryContainer + '30' },
        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border.subtle },
      ]}
    >
      {/* Emoji bubble — aligned to top so it sits beside the title */}
      <View style={[styles.emojiBubble, { backgroundColor: color }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      {/* Text + optional CTA */}
      <View style={styles.textBlock}>
        <Text
          style={[
            notification.isRead ? TextStyles.body : TextStyles.bodyMedium,
            { color: colors.text.primary },
          ]}
          numberOfLines={1}
        >
          {notification.title}
        </Text>
        <Text style={[TextStyles.bodySmall, { color: colors.text.secondary }]} numberOfLines={2}>
          {notification.body}
        </Text>

        {/* invite.received → Accept Invite pill */}
        {isInvite && onAcceptInvite && (
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: colors.primaryContainer }]}
            onPress={(e) => {
              e.stopPropagation?.();
              onAcceptInvite();
            }}
            activeOpacity={0.75}
          >
            <Ionicons name="checkmark-circle-outline" size={14} color={colors.primary} />
            <Text style={[TextStyles.captionBold, { color: colors.primary }]}>Accept Invite</Text>
          </TouchableOpacity>
        )}

        {/* action field → confirm_settlement | view_dispute pill */}
        {!isInvite && actionCta && onPress && (
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: ctaBg }]}
            onPress={(e) => {
              e.stopPropagation?.();
              onPress();
            }}
            activeOpacity={0.75}
          >
            <Ionicons name={actionCta.iconName} size={14} color={ctaFg} />
            <Text style={[TextStyles.captionBold, { color: ctaFg }]}>{actionCta.label}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Right: time + unread dot + chevron */}
      <View style={styles.meta}>
        <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>{timeLabel}</Text>
        <View style={styles.indicators}>
          {!notification.isRead && (
            <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
          )}
          {isNavigable && (
            <FontAwesome6 name="chevron-right" size={10} color={colors.text.disabled} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  emojiBubble: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  emoji: {
    fontSize: 20,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  meta: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
    flexShrink: 0,
    marginTop: 2,
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'stretch',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
});
