import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import { Split } from '@/features/expenses/expenses.interface';
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
          const amount = split.amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

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
                  {currency} {amount}
                </Text>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: split.settled
                        ? colors.status.settledContainer
                        : colors.status.pendingContainer,
                    },
                  ]}
                >
                  <Text
                    style={[
                      TextStyles.captionBold,
                      {
                        color: split.settled
                          ? colors.status.onSettledContainer
                          : colors.status.onPendingContainer,
                      },
                    ]}
                  >
                    {split.settled ? 'Settled' : 'Pending'}
                  </Text>
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
