import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import { Split } from '@/features/expenses/expenses.interface';
import { formatAmount } from '@/core/common/utils/currency';
import MemberAvatar from '@/core/common/components/member-avatar';
import useGetName from '@/core/common/hooks/use-get-name';

interface Props {
  splits: Split[];
  currency: string;
}

export default function ExpenseSplits({ splits, currency }: Props) {
  const colors = useThemeColors();
  const getName = useGetName();

  return (
    <View style={styles.section}>
      <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Split Details</Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border.default },
        ]}
      >
        {splits.map((split, index) => {
          const displayName = split.name
            ? getName({ id: split.owedBy ?? '', name: split.name })
            : 'Unknown';
          const isSettled = split.amountRemaining === 0;
          const isPartial = !isSettled && split.amountRemaining < split.amount;

          const badgeBackground = isSettled
            ? colors.status.settledContainer
            : isPartial
              ? colors.status.infoContainer
              : colors.status.pendingContainer;

          const badgeText = isSettled
            ? colors.status.onSettledContainer
            : isPartial
              ? colors.status.onInfoContainer
              : colors.status.onPendingContainer;

          const badgeLabel = isSettled ? 'Settled' : isPartial ? 'Partially Owing' : 'Owing';
          const displayAmount = isSettled ? split.amount : split.amountRemaining;

          return (
            <View
              key={split.id}
              style={[
                styles.row,
                index < splits.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border.subtle,
                  paddingBottom: Spacing.sm,
                  marginBottom: Spacing.sm,
                },
              ]}
            >
              <View style={styles.memberInfo}>
                {split.name ? (
                  <MemberAvatar name={split.name} avatarUrl={split.avatarUrl} avatarSize={36} />
                ) : (
                  <View
                    style={[styles.avatarFallback, { backgroundColor: colors.border.default }]}
                  />
                )}
                <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>
                  {displayName}
                </Text>
              </View>

              <View style={styles.splitRight}>
                <Text style={[TextStyles.amountSmall, { color: colors.text.primary }]}>
                  {currency} {formatAmount(displayAmount)}
                </Text>
                <View style={[styles.badge, { backgroundColor: badgeBackground }]}>
                  <Text style={[TextStyles.captionBold, { color: badgeText }]}>{badgeLabel}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
  },
  card: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  splitRight: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
});
