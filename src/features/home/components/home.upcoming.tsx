import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { UpcomingExpense } from '@/features/expenses/expenses.interface';
import { Border, Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import useUpcomingExpenses from '@/features/expenses/hooks/use-upcoming-expenses';
import SkeletonBox from '@/core/common/components/skeleton-box';
import EmptyState from '@/core/common/components/empty-state';
import { formatAmount } from '@/core/common/utils/currency';
import useExpensesStore from '@/features/expenses/expenses.state';
import useGroupsStore from '@/features/groups/groups.state';

const UpcomingCard = ({
  upcoming,
  onPress,
}: {
  upcoming: UpcomingExpense;
  onPress: () => void;
}) => {
  const colors = useThemeColors();

  const getDueLabel = (date: Date) => {
    const now = moment().startOf('day');
    const target = moment(date).startOf('day');
    const diff = target.diff(now, 'days');
    if (diff === 0) return 'Due today';
    if (diff === 1) return 'Due tomorrow';
    if (diff > 1 && diff <= 6) return `Due in ${diff} days`;
    return `Due ${target.format('MMM D')}`;
  };

  const dueLabel = getDueLabel(upcoming.nextOccurrenceAt);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        groupCardStyles.groupCard,
        { backgroundColor: colors.surface, borderColor: colors.border.default },
      ]}
    >
      <Text style={[TextStyles.label, { color: colors.text.primary }]}>{upcoming.description}</Text>
      <Text style={[TextStyles.amountMedium, { color: colors.text.primary }]}>
        {upcoming.currency} {formatAmount(upcoming.amount)}
      </Text>
      <Text style={[TextStyles.caption, { color: colors.secondary }]}>{dueLabel}</Text>
    </TouchableOpacity>
  );
};

const groupCardStyles = StyleSheet.create({
  groupCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: Border.thin,
    minWidth: 170,
  },
});

export default function HomeUpcoming() {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const { upcomingExpenses, isLoading } = useUpcomingExpenses(5);
  const { setDraftExpense } = useExpensesStore();
  const { setSelectedGroup } = useGroupsStore();

  const handleUpcomingPress = (upcoming: UpcomingExpense) => {
    setSelectedGroup(null);
    setDraftExpense({
      amount: upcoming.amount,
      description: upcoming.description ?? undefined,
      categoryId: upcoming.categoryId ?? undefined,
      currency: upcoming.currency,
      isRecurring: true,
      recurrenceFrequency: upcoming.recurrenceFrequency,
    });
    navigation.navigate('NewExpenseHome' as never);
  };

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
          renderItem={({ item }) => (
            <UpcomingCard upcoming={item} onPress={() => handleUpcomingPress(item)} />
          )}
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
