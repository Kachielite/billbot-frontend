import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { GlassView } from 'expo-glass-effect';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import SkeletonCard from '@/core/common/components/skeleton-card';
import { MemberSummary } from '@/features/balances/balances.interface';
import useProfile from '@/features/user/hooks/use-profile';
import { formatAmount } from '@/core/common/utils/currency';

type PoolBalancesProps = {
  isLoading: boolean;
  memberSummary: MemberSummary[];
  totalAmount: number;
  amountCollected: number;
  totalExpenses: number;
  splitType: string;
};

export default function PoolBalances({
  isLoading,
  memberSummary,
  totalAmount,
  amountCollected,
  totalExpenses,
  splitType,
}: PoolBalancesProps) {
  const colors = useThemeColors();
  const { profile, isLoading: isLoadingUserProfile } = useProfile();
  if (isLoading || isLoadingUserProfile) {
    return (
      <SkeletonCard
        tintColor={colors.primary}
        containerStyle={[styles.container, { backgroundColor: colors.primary }]}
        cardBg={colors.primaryCard?.pillBg}
      />
    );
  }

  const userBalances = memberSummary.find((m) => m.user.id === profile?.id);
  const net = userBalances?.netBalance ?? 0;
  const balances = [
    {
      label: 'YOU PAID',
      amount: userBalances?.totalPaid ?? 0,
      isOwe: false,
    },
    {
      label: net > 0 ? 'OWED TO YOU' : net < 0 ? 'YOU OWE' : 'SETTLED',
      amount: Math.abs(net),
      isOwe: net < 0,
    },
  ];

  const currency = profile?.currency?.symbol || '$';
  const percentageCollected = totalAmount > 0 ? (amountCollected / totalAmount) * 100 : 0;

  return (
    <GlassView
      tintColor={colors.primary}
      style={[styles.container, { backgroundColor: colors.primary }]}
    >
      <View style={styles.totalBalance}>
        <Text style={[TextStyles.captionBold, { color: colors.primaryCard.labelText }]}>
          TAB TOTAL
        </Text>
        <Text style={[TextStyles.displayLarge, { color: colors.text.onPrimary }]}>
          {currency} {formatAmount(totalAmount)}
        </Text>
        <Text style={[TextStyles.caption, { color: colors.primaryCard.labelText }]}>
          {totalExpenses} expenses · {splitType === 'equal' ? 'Equal' : 'Unequal'} split
        </Text>
        <View style={[styles.divider, { backgroundColor: colors.text.inverse }]} />
      </View>
      <View style={styles.balanceCardContainer}>
        {balances.map((balance, index) => (
          <View
            key={index}
            style={[styles.balanceCard, { backgroundColor: colors.primaryCard.pillBg }]}
          >
            <Text style={[TextStyles.label, { color: colors.text.inverse }]}>{balance.label}</Text>
            <Text
              style={[
                TextStyles.headingSmall,
                {
                  color: (balance as any).isOwe
                    ? colors.status.disputedContainer
                    : colors.text.onPrimary,
                },
              ]}
            >
              {currency} {formatAmount(balance.amount)}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.balanceBar}>
        <View style={styles.balanceBarLabel}>
          <Text style={[TextStyles.captionBold, { color: colors.primaryCard.labelText }]}>
            COLLECTED
          </Text>
          <View style={styles.balanceBarLabel}>
            <Text style={[TextStyles.captionBold, { color: colors.text.onPrimary }]}>
              {currency} {formatAmount(amountCollected)}
            </Text>
            <Text
              style={[
                [
                  TextStyles.captionBold,
                  { color: colors.text.onPrimary, marginHorizontal: Spacing.xs },
                ],
              ]}
            >
              /
            </Text>
            <Text style={[TextStyles.captionBold, { color: colors.text.onPrimary }]}>
              {currency} {formatAmount(totalAmount)}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.balanceBar,
            {
              backgroundColor: colors.primaryCard.pillBg,
              height: 10,
              borderRadius: Radius.sm,
              overflow: 'hidden',
            },
          ]}
        >
          <View
            style={[
              {
                width: `${percentageCollected}%`,
                height: '100%',
                borderRadius: Radius.full,
                backgroundColor: colors.primaryContainer,
              },
            ]}
          />
        </View>
      </View>
    </GlassView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  totalBalance: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  balanceCardContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  balanceCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  divider: {
    width: '100%',
    height: 0.2,
    marginVertical: Spacing.md,
  },
  balanceBar: {
    marginTop: Spacing.md,
    display: 'flex',
    flexDirection: 'column',
  },
  balanceBarLabel: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
