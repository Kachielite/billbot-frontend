import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import getInitials from '@/core/common/utils/get-initials';
import { Pool } from '@/features/pools/pools.interface';
import usePoolsStore from '@/features/pools/pools.state';
import { formatAmount } from '@/core/common/utils/currency';

export const TabCard = ({ pool }: { pool: Pool }) => {
  const navigation = useNavigation();
  const { setSelectedPool } = usePoolsStore();
  const colors = useThemeColors();
  const amountColor =
    pool.balance?.netBalance && pool.balance.netBalance < 0 ? colors.error : colors.primary;
  let activityStatus = '';
  switch (pool.activityStatus) {
    case 'empty':
      activityStatus = 'No activity';
      break;
    case 'ongoing':
      activityStatus = 'Ongoing';
      break;
    case 'settled':
      activityStatus = 'Settled';
      break;
    default:
      activityStatus = '';
  }

  return (
    <TouchableOpacity
      style={[
        poolCardStyles.poolCard,
        {
          padding: Spacing.md,
          borderColor: colors.border.default,
          borderWidth: 1,
          backgroundColor: colors.surface,
        },
      ]}
      onPress={() => {
        setSelectedPool(pool);
        navigation.navigate('Pool', { poolId: pool.id });
      }}
    >
      <View style={[poolCardStyles.emojiContainer, { backgroundColor: colors.primaryContainer }]}>
        <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>
          {getInitials(pool.name)}
        </Text>
      </View>
      <View style={poolCardStyles.contentRow}>
        <View style={poolCardStyles.leftColumn}>
          <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>{pool.name}</Text>
          <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>
            {pool.expenseCount} expenses
          </Text>
        </View>
        <View style={poolCardStyles.rightColumn}>
          <View style={poolCardStyles.rightTopRow}>
            <Text style={[TextStyles.amountSmall, { color: amountColor }]}>
              {pool.balance?.currency}
            </Text>
            <Text style={[TextStyles.amountSmall, { color: amountColor }]}>
              {formatAmount(pool.balance?.netBalance ?? 0)}
            </Text>
          </View>
          <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>
            {activityStatus}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const poolCardStyles = StyleSheet.create({
  poolCard: {
    borderRadius: Radius.lg,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    width: '100%',
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightTopRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.xs,
  },
});
