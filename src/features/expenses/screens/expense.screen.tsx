import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import useRefetchOnFocus from '@/core/common/hooks/use-refetch-on-focus';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import ScreenLoader from '@/core/common/components/screen.loader';
import ConfirmDeleteModal from '@/core/common/components/confirm-delete-modal';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import useExpenseDetail from '@/features/expenses/hooks/use-expense-detail';
import useDeleteExpense from '@/features/expenses/hooks/use-delete-expense';
import useCancelRecurrence from '@/features/expenses/hooks/use-cancel-recurrence';
import usePoolDetail from '@/features/pools/hooks/use-pool-detail';
import useGroupDetail from '@/features/groups/hooks/use-group-detail';
import useCategories from '@/features/categories/hooks/use-categories';
import useGetName from '@/core/common/hooks/use-get-name';
import ExpenseDetailHeader from '@/features/expenses/components/expense.header';
import ExpenseHero from '@/features/expenses/components/expense-hero';
import ExpenseSplits from '@/features/expenses/components/expense-splits';
import ReceiptViewer from '@/features/expenses/components/receipt-viewer';

type Props = StaticScreenProps<{ poolId: string; expenseId: string }>;

const FREQUENCY_LABEL: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export default function ExpenseScreen({ route }: Props) {
  const { poolId, expenseId } = route.params;
  const { canGoBack, goBack } = useNavigation();
  const colors = useThemeColors();
  const getName = useGetName();

  const { isLoading, expense, refetch: refetchExpense } = useExpenseDetail(poolId, expenseId);
  const { pool, refetch: refetchPool } = usePoolDetail(poolId);
  const { group, refetch: refetchGroup } = useGroupDetail(pool?.groupId ?? '');

  useRefetchOnFocus([refetchExpense, refetchPool, refetchGroup]);
  const { categories } = useCategories();
  const { deleteExpense, isDeleting } = useDeleteExpense(poolId);
  const { cancelRecurrence, isCancelling } = useCancelRecurrence(poolId);

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [showReceipt, setShowReceipt] = React.useState(false);

  const category = categories.find((c) => c.id === expense?.categoryId) ?? null;
  const members = group?.members ?? [];

  const paidByMember = members.find((m) => m.userId === expense?.paidBy) ?? null;
  const paidByName = paidByMember
    ? getName({ id: paidByMember.userId, name: paidByMember.name })
    : expense?.paidBy
      ? 'Unknown'
      : '—';

  const handleConfirmDelete = async () => {
    await deleteExpense(expenseId);
    setShowDeleteModal(false);
    if (canGoBack()) goBack();
  };

  const handleConfirmCancelRecurrence = async () => {
    await cancelRecurrence(expenseId);
    setShowCancelModal(false);
  };

  if (isLoading) return <ScreenLoader />;

  if (!expense) {
    return (
      <ScreenContainer>
        <Text style={[TextStyles.body, { color: colors.text.secondary }]}>Expense not found.</Text>
      </ScreenContainer>
    );
  }

  const infoRows = [
    { label: 'PAID BY', value: paidByName },
    {
      label: 'CATEGORY',
      value: category ? `${category.emoji} ${category.name}` : (expense.categoryEmoji ?? '—'),
    },
    { label: 'CURRENCY', value: expense.currency },
    { label: 'LOGGED', value: moment(expense.createdAt).format('MMMM D, YYYY [at] h:mm A') },
  ];

  const recurrenceRows = expense.isRecurring
    ? [
        {
          label: 'FREQUENCY',
          value:
            FREQUENCY_LABEL[expense.recurrenceFrequency ?? ''] ??
            expense.recurrenceFrequency ??
            '—',
        },
        {
          label: 'NEXT OCCURRENCE',
          value: expense.nextOccurrenceAt
            ? moment(expense.nextOccurrenceAt).format('MMMM D, YYYY')
            : '—',
        },
        {
          label: 'END DATE',
          value: expense.recurrenceEndDate
            ? moment(expense.recurrenceEndDate).format('MMMM D, YYYY')
            : 'No end date',
        },
      ]
    : [];

  return (
    <ScreenContainer useScrollView={false}>
      <ExpenseDetailHeader
        poolName={pool?.name ?? ''}
        expense={expense}
        onDeletePress={() => setShowDeleteModal(true)}
        onCancelRecurrencePress={() => setShowCancelModal(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? Spacing.xxl : 100,
          gap: Spacing.xxl,
        }}
      >
        <ExpenseHero expense={expense} />

        {/* ── Details ── */}
        <View style={styles.section}>
          <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Details</Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border.default },
            ]}
          >
            {infoRows.map((row, index) => (
              <View
                key={row.label}
                style={[
                  styles.infoRow,
                  index < infoRows.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border.subtle,
                    paddingBottom: Spacing.sm,
                    marginBottom: Spacing.sm,
                  },
                ]}
              >
                <Text style={[TextStyles.label, { color: colors.text.disabled }]}>{row.label}</Text>
                <Text style={[TextStyles.bodySmall, { color: colors.text.primary }]}>
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Recurrence ── */}
        {expense.isRecurring && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Recurrence</Text>
              <View
                style={[styles.recurringBadge, { backgroundColor: colors.status.infoContainer }]}
              >
                <Ionicons name="repeat" size={12} color={colors.status.info} />
                <Text style={[TextStyles.captionBold, { color: colors.status.onInfoContainer }]}>
                  Active
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border.default },
              ]}
            >
              {recurrenceRows.map((row, index) => (
                <View
                  key={row.label}
                  style={[
                    styles.infoRow,
                    index < recurrenceRows.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border.subtle,
                      paddingBottom: Spacing.sm,
                      marginBottom: Spacing.sm,
                    },
                  ]}
                >
                  <Text style={[TextStyles.label, { color: colors.text.disabled }]}>
                    {row.label}
                  </Text>
                  <Text style={[TextStyles.bodySmall, { color: colors.text.primary }]}>
                    {row.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Splits ── */}
        {expense.splits && expense.splits.length > 0 && (
          <ExpenseSplits splits={expense.splits} currency={expense.currency} />
        )}

        {/* ── Receipt ── */}
        {expense.receiptUrl && (
          <View style={styles.section}>
            <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Receipt</Text>
            <TouchableOpacity activeOpacity={0.85} onPress={() => setShowReceipt(true)}>
              <Image
                source={{ uri: expense.receiptUrl }}
                style={[styles.receiptImage, { borderColor: colors.border.default }]}
                resizeMode="cover"
              />
              <View style={[styles.receiptOverlay, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
                <Ionicons name="expand-outline" size={28} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <ConfirmDeleteModal
        visible={showDeleteModal}
        icon="trash-outline"
        title="Delete expense?"
        message="This will permanently remove the expense and all its splits."
        isLoading={isDeleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />

      <ConfirmDeleteModal
        visible={showCancelModal}
        icon="repeat-outline"
        title="Cancel recurrence?"
        message="No further occurrences will be created. Existing expense entries are not affected."
        confirmLabel="Cancel Recurrence"
        isLoading={isCancelling}
        onCancel={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancelRecurrence}
      />

      {expense.receiptUrl && (
        <ReceiptViewer
          uri={expense.receiptUrl}
          visible={showReceipt}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  card: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recurringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  receiptImage: {
    width: '100%',
    height: 220,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  receiptOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
