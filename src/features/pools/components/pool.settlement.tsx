import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TextStyles } from '@/core/common/constants/fonts';
import { Radius, Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { BalanceEntry, MemberSummary } from '@/features/balances/balances.interface';
import useGetName from '@/core/common/hooks/use-get-name';

type Props = {
  balances: BalanceEntry[];
  isLoading: boolean;
};

export default function PoolSettlement({ balances, isLoading }: Props) {
  const colors = useThemeColors();
  const getName = useGetName();

  return (
    <View style={styles.container}>
      <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>
        Settlement Breakdown
      </Text>
      <View
        style={[
          styles.summaryContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border.default,
          },
        ]}
      >
        {balances.map((entry, index) => {
          const from = entry.from.name;
          const fromId = entry.from.id;
          const to = entry.to.name;
          const toId = entry.to.id;
          const currency = entry.currency;
          const amount = entry.amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          return (
            <View style={styles.breakdownEntry} key={index}>
              <View style={styles.breakdownEntryDetails}>
                <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>
                  {getName({ id: fromId, name: from })}
                </Text>
                <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>owes</Text>
                <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>
                  {getName({ id: toId, name: to })}
                </Text>
              </View>
              <View>
                <Text style={[TextStyles.amountSmall, { color: colors.error }]}>
                  {currency} {amount}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.md,
    width: '100%',
  },
  summaryContainer: {
    flexDirection: 'column',
    gap: Spacing.sm,
    width: '100%',
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  breakdownEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownEntryDetails: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
});
