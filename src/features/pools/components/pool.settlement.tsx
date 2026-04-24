import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { TextStyles } from '@/core/common/constants/fonts';
import { Radius, Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { BalanceEntry } from '@/features/balances/balances.interface';
import useGetName from '@/core/common/hooks/use-get-name';
import useProfile from '@/features/user/hooks/use-profile';
import SkeletonBox from '@/core/common/components/skeleton-box';
import Tooltip from '@/core/common/components/tooltip';

type Props = {
  balances: BalanceEntry[];
  isLoading: boolean;
};

export default function PoolSettlement({ balances, isLoading }: Props) {
  const colors = useThemeColors();
  const getName = useGetName();
  const { profile } = useProfile();

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: Spacing.xs,
        }}
      >
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>
          Settlement Breakdown
        </Text>
        <Tooltip description="Red indicates a member owes money; green indicates a member is owed money." />
      </View>
      <View
        style={[
          styles.summaryContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border.default,
          },
        ]}
      >
        {isLoading
          ? // Render skeleton rows that mirror the settlement layout
            Array.from({ length: 4 }).map((_, i) => (
              <View
                style={[
                  styles.breakdownEntry,
                  i < 3 && {
                    paddingBottom: Spacing.sm,
                    marginBottom: Spacing.sm,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border.subtle,
                  },
                ]}
                key={`skel-${i}`}
              >
                <View style={styles.breakdownEntryDetailsSkeleton}>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <SkeletonBox
                      width={140}
                      height={18}
                      bg={colors.surface}
                      style={{ borderRadius: Radius.sm }}
                    />
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                  {/* pill skeleton - square on the side facing the divider */}
                  <SkeletonBox
                    width={110}
                    height={36}
                    bg={colors.surface}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  />
                </View>
              </View>
            ))
          : balances.map((entry, index) => {
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
                <View
                  style={[
                    styles.breakdownEntry,
                    index < balances.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border.subtle,
                      paddingBottom: Spacing.sm,
                      marginBottom: Spacing.sm,
                    },
                  ]}
                  key={index}
                >
                  <View style={styles.breakdownEntryDetails}>
                    <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>
                      {getName({ id: fromId, name: from })}
                    </Text>
                    <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>owes</Text>
                    <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>
                      {getName({ id: toId, name: to })}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[TextStyles.amountSmall, { color: colors.error }]}>
                      {currency} {amount}
                    </Text>
                    {/* If the current user is the debtor (from), show a dummy "Settle" button */}
                    {profile?.id === entry.from.id && (
                      <TouchableOpacity
                        style={[
                          styles.settleBtn,
                          { backgroundColor: colors.primaryContainer, borderColor: colors.primary },
                        ]}
                        onPress={() => {
                          // dummy handler for now
                        }}
                      >
                        <Text style={[TextStyles.label, { color: colors.primary }]}>Settle</Text>
                      </TouchableOpacity>
                    )}
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
  breakdownEntryDetailsSkeleton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  divider: {
    width: 1.5,
    alignSelf: 'stretch',
    marginHorizontal: Spacing.xs,
  },
  settleBtn: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
});
