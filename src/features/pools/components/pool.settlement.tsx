import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { TextStyles } from '@/core/common/constants/fonts';
import { Radius, Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { BalanceEntry } from '@/features/balances/balances.interface';
import useGetName from '@/core/common/hooks/use-get-name';
import useProfile from '@/features/user/hooks/use-profile';
import SkeletonBox from '@/core/common/components/skeleton-box';
import Tooltip from '@/core/common/components/tooltip';
import { formatAmount } from '@/core/common/utils/currency';
import EmptyState from '@/core/common/components/empty-state';
import usePoolSettlements from '@/features/settlements/hooks/use-pool-settlements';
import { useNavigation } from '@react-navigation/native';

type Props = {
  balances: BalanceEntry[];
  isLoading: boolean;
  poolId: string;
};

export default function PoolSettlement({ balances, isLoading, poolId }: Props) {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const getName = useGetName();
  const { profile } = useProfile();
  const { settlements, isLoading: isLoadingSettlement } = usePoolSettlements(poolId);

  const settlementStatus = React.useCallback(
    (toUser: string, fromUser: string, amount: number) => {
      const settlementInQuestion = settlements?.find(
        (s) => s.toUser === toUser && s.fromUser === fromUser && s.amount === amount,
      );
      if (settlementInQuestion) {
        return settlementInQuestion.status;
      }
      return null;
    },
    [settlements],
  );

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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Breakdown</Text>
            <Tooltip description="Showing who owes who based on the expenses added to this tab. The amounts shown here are what each person owes or is owed, and may not reflect the total amount they paid or owe for the entire tab." />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Settlements', { poolId })}>
            <Text style={[TextStyles.label, { color: colors.primary }]}>View Settlements</Text>
          </TouchableOpacity>
        </View>
      </View>
      {!(isLoading || isLoadingSettlement) && balances.length === 0 ? (
        <EmptyState title="All settled up" subtitle="No outstanding balances in this tab." />
      ) : (
        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border.default,
            },
          ]}
        >
          {isLoading || isLoadingSettlement
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
                const amount = formatAmount(entry.amount);
                const settlementState = settlementStatus(toId, fromId, entry.amount);

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
                      <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>
                        owes
                      </Text>
                      <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>
                        {getName({ id: toId, name: to })}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[TextStyles.amountSmall, { color: colors.error }]}>
                        {currency} {amount}
                      </Text>
                      {settlementState === 'pending_verification' &&
                        profile?.id === entry.from.id && (
                          <Text
                            style={[
                              TextStyles.caption,
                              styles.settleBtn,
                              {
                                color: colors.status.onPendingContainer,
                                backgroundColor: colors.status.pendingContainer,
                                borderColor: colors.status.pending,
                              },
                            ]}
                          >
                            Pending verification
                          </Text>
                        )}
                      {settlementState !== 'pending_verification' &&
                        profile?.id === entry.from.id && (
                          <TouchableOpacity
                            style={[
                              styles.settleBtn,
                              {
                                backgroundColor: colors.primaryContainer,
                                borderColor: colors.primary,
                              },
                            ]}
                            onPress={() => {
                              const toUserId = toId;
                              const amount = entry.amount;
                              navigation.navigate('RecordPayment', { poolId, toUserId, amount });
                            }}
                          >
                            <Text style={[TextStyles.label, { color: colors.primary }]}>
                              Settle
                            </Text>
                          </TouchableOpacity>
                        )}
                    </View>
                  </View>
                );
              })}
        </View>
      )}
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
