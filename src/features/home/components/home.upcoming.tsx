import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { UpcomingExpense } from '@/features/expenses/expenses.interface';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import useUpcomingExpenses from '@/features/expenses/hooks/use-upcoming-expenses';
import SkeletonBox from '@/core/common/components/skeleton-box';
import EmptyState from '@/core/common/components/empty-state';

// TODO: Remove this upcoming mock data once you create the data
const UPCOMING_MOCK: UpcomingExpense[] = [
  {
    id: 'u1',
    poolId: 'p1',
    paidBy: 'user1',
    amount: 2500.0,
    currency: 'NGN',
    description: 'Electricity bill',
    categoryId: 'c-bills',
    receiptUrl: null,
    isRecurring: true,
    recurrenceFrequency: 'monthly',
    recurrenceEndDate: null,
    recurrenceParentId: null,
    nextOccurrenceAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // one week from now
    createdAt: new Date(),
  },
  {
    id: 'u2',
    poolId: 'p2',
    paidBy: 'user2',
    amount: 120.5,
    currency: 'NGN',
    description: 'Netflix subscription',
    categoryId: 'c-entertainment',
    receiptUrl: null,
    isRecurring: true,
    recurrenceFrequency: 'monthly',
    recurrenceEndDate: null,
    recurrenceParentId: null,
    nextOccurrenceAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // three days from now
    createdAt: new Date(),
  },
  {
    id: 'u3',
    poolId: 'p3',
    paidBy: 'user3',
    amount: 4500,
    currency: 'NGN',
    description: 'Monthly rent',
    categoryId: 'c-housing',
    receiptUrl: null,
    isRecurring: true,
    recurrenceFrequency: 'monthly',
    recurrenceEndDate: null,
    recurrenceParentId: null,
    nextOccurrenceAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // two weeks from now
    createdAt: new Date(),
  },
  {
    id: 'u4',
    poolId: 'p4',
    paidBy: 'user1',
    amount: 800,
    currency: 'NGN',
    description: 'Gym membership',
    categoryId: 'c-fitness',
    receiptUrl: null,
    isRecurring: true,
    recurrenceFrequency: 'monthly',
    recurrenceEndDate: null,
    recurrenceParentId: null,
    nextOccurrenceAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // one day from now
    createdAt: new Date(),
  },
];

const UpcomingCard = ({ upcoming }: { upcoming: UpcomingExpense }) => {
  const colors = useThemeColors();

  const getDueLabel = (date: Date) => {
    const now = moment().startOf('day');
    const target = moment(date).startOf('day');
    const diff = target.diff(now, 'days');

    if (diff === 0) return 'Due today';
    if (diff === 1) return 'Due tomorrow';
    if (diff > 1 && diff <= 6) return `Due in ${diff} days`;
    // otherwise show month and day
    return `Due ${target.format('MMM D')}`;
  };

  const amountLabel = getDueLabel(upcoming.nextOccurrenceAt);

  return (
    <View
      style={[
        groupCardStyles.groupCard,
        { backgroundColor: colors.surface, borderColor: colors.border.subtle },
      ]}
    >
      <Text style={[TextStyles.label, { color: colors.text.primary }]}>{upcoming.description}</Text>
      <Text style={[TextStyles.amountMedium, { color: colors.text.primary }]}>
        {upcoming.currency}{' '}
        {upcoming.amount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Text>
      <Text style={[TextStyles.caption, { color: colors.secondary }]}>{amountLabel}</Text>
    </View>
  );
};

const groupCardStyles = StyleSheet.create({
  groupCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    minWidth: 170,
  },
});

export default function HomeUpcoming() {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const { upcomingExpenses, isLoading } = useUpcomingExpenses(5);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Upcoming</Text>
        {upcomingExpenses.length > 0 ? (
          <TouchableOpacity onPress={() => navigation.navigate('UpcomingExpenses' as never)}>
            <Text style={[TextStyles.label, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {isLoading ? (
        <View style={{ flexDirection: 'row', paddingVertical: Spacing.sm }}>
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBox key={i} width={170} height={110} bg={colors.surface} />
          ))}
        </View>
      ) : upcomingExpenses.length === 0 ? (
        <EmptyState
          title="No upcoming expenses"
          subtitle="You have no upcoming recurring expenses."
        />
      ) : (
        <FlatList
          data={upcomingExpenses}
          renderItem={({ item }) => <UpcomingCard upcoming={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: Spacing.md,
            paddingVertical: Spacing.sm,
          }}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.md,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
