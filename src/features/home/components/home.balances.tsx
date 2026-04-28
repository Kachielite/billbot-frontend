import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { GlassView } from 'expo-glass-effect';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Spacing } from '@/core/common/constants/theme';
import useUserBalances from '@/features/balances/hooks/use-user-balances';
import { TextStyles } from '@/core/common/constants/fonts';
import SkeletonCard from '@/core/common/components/skeleton-card';
import { formatAmount } from '@/core/common/utils/currency';

export default function HomeBalances() {
  const colors = useThemeColors();
  const { userBalances, isLoading } = useUserBalances();
  const netBalance = userBalances.totalOwedToMe - userBalances.totalOwed;

  // Skeleton loader moved to a reusable component `SkeletonCard`

  const balances = [
    {
      label: 'OWED TO ME',
      amount: userBalances.totalOwedToMe,
    },
    {
      label: 'YOU OWE',
      amount: userBalances.totalOwed,
    },
  ];
  if (isLoading) {
    return (
      <SkeletonCard
        tintColor={colors.primary}
        containerStyle={[styles.container, { backgroundColor: colors.primary }]}
        cardBg={colors.primaryCard?.pillBg}
      />
    );
  }

  return (
    <GlassView
      tintColor={colors.primary}
      style={[styles.container, { backgroundColor: colors.primary }]}
    >
      <View style={styles.totalBalance}>
        <Text style={[TextStyles.label, { color: colors.primaryCard.labelText }]}>
          YOUR NET BALANCE
        </Text>
        <Text style={[TextStyles.displaySmall, { color: colors.text.onPrimary }]}>
          {userBalances.currency} {formatAmount(netBalance)}
        </Text>
        <Text style={[TextStyles.label, { color: colors.primaryCard.subtitleText }]}>
          ACROSS ALL GROUPS
        </Text>
      </View>
      <View style={styles.balanceCardContainer}>
        {balances.map((balance, index) => (
          <View
            key={index}
            style={[styles.balanceCard, { backgroundColor: colors.primaryCard.pillBg }]}
          >
            <Text style={[TextStyles.label, { color: colors.text.inverse }]}>{balance.label}</Text>
            <Text style={[TextStyles.headingSmall, { color: colors.text.onPrimary }]}>
              {userBalances.currency} {formatAmount(balance.amount)}
            </Text>
          </View>
        ))}
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
    marginTop: Spacing.md,
  },
  balanceCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  // skeleton styles moved to `SkeletonCard` component
});
