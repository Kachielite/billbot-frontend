import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Card, Input, Radius, Spacing } from '@/core/common/constants/theme';
import useGroupsStore from '@/features/groups/groups.state';
import { formatAmount } from '@/core/common/utils/currency';
import useGroupDetail from '@/features/groups/hooks/use-group-detail';
import { GroupMember } from '@/features/groups/groups.interface';
import useProfile from '@/features/user/hooks/use-profile';
import getInitials from '@/core/common/utils/get-initials';
import { UseFormReturn } from 'react-hook-form';
import { LogExpenseSchemaType } from '@/features/expenses/expenses.dto';
import { Ionicons } from '@expo/vector-icons';

const AVATAR_SIZE = 45;

const SPLIT_OPTIONS = [
  {
    label: 'Evenly',
    value: 'evenly',
    emoji: '⚖️',
    description: 'Split the expense evenly among all participants.',
  },
  {
    label: 'Custom',
    value: 'custom',
    emoji: '🛠️',
    description: 'Manually assign amounts to each participant.',
  },
];

type MemberCardProps = {
  member: GroupMember;
  index: number;
  isLast: boolean;
  amount: string;
  onAmountChange: (userId: string, value: string) => void;
};

const MemberCard = ({ member, index, isLast, amount, onAmountChange }: MemberCardProps) => {
  const colors = useThemeColors();
  const swatch = colors.groupColors[index % colors.groupColors.length];
  const { profile } = useProfile();
  return (
    <View
      style={[
        styles.memberContainer,
        { backgroundColor: colors.surface },
        !isLast && { borderBottomWidth: Border.thin, borderBottomColor: colors.border.default },
      ]}
    >
      <View style={styles.memberInfo}>
        {member.avatarUrl ? (
          <Image
            source={{ uri: member.avatarUrl }}
            style={[styles.avatar, { borderColor: colors.surface }]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[styles.avatar, { backgroundColor: swatch.fill, borderColor: colors.surface }]}
          >
            <Text style={[styles.initials, { color: swatch.on }]}>{getInitials(member.name)}</Text>
          </View>
        )}
        <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>
          {member.name.split(' ')[0]} {profile?.id === member.userId ? '(You)' : ''}
        </Text>
      </View>

      <TextInput
        style={[
          styles.amountInput,
          {
            borderColor: colors.border.default,
            backgroundColor: colors.background,
            color: colors.text.primary,
          },
        ]}
        value={amount}
        onChangeText={(v) => onAmountChange(member.userId, v)}
        placeholder="0.00"
        placeholderTextColor={colors.text.secondary}
        keyboardType="decimal-pad"
      />
    </View>
  );
};

type SplitExpenseProps = {
  form: UseFormReturn<LogExpenseSchemaType>;
};

export default function SplitExpense({ form }: SplitExpenseProps) {
  const colors = useThemeColors();
  const [selectedOption, setSelectedOption] = React.useState<string>('evenly');
  const { selectedGroup } = useGroupsStore();
  const { group, isLoading: isLoadingMembers } = useGroupDetail(selectedGroup?.id ?? '');
  const members = group?.members ?? [];
  const [memberAmounts, setMemberAmounts] = React.useState<Record<string, string>>({});

  const totalAmount = form.watch('amount') ?? 0;
  const splitsError = form.formState.errors.splits?.message as string | undefined;

  const allocated = Object.values(memberAmounts).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
  const remaining = Math.round((totalAmount - allocated) * 100) / 100;
  const isPerfect = allocated > 0 && remaining === 0;
  const isOver = remaining < 0;

  const syncSplitsToForm = (amounts: Record<string, string>) => {
    const splits = members
      .map((m) => ({ userId: m.userId, amount: parseFloat(amounts[m.userId] ?? '') }))
      .filter((s) => !isNaN(s.amount) && s.amount > 0);
    form.setValue('splits', splits.length ? splits : undefined, { shouldValidate: true });
  };

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    if (value === 'evenly') {
      setMemberAmounts({});
      form.setValue('splits', undefined);
    }
  };

  const handleAmountChange = (userId: string, value: string) => {
    setMemberAmounts((prev) => {
      const updated = { ...prev, [userId]: value };
      syncSplitsToForm(updated);
      return updated;
    });
  };

  const remainingColor = isPerfect ? colors.primary : isOver ? colors.error : colors.text.secondary;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'column', gap: Spacing.sm }}>
        <Text style={[TextStyles.label, { color: colors.text.primary }]}>SPLIT</Text>
        <View style={styles.splitOptionsContainer}>
          {SPLIT_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.splitOption,
                {
                  borderColor:
                    selectedOption === option.value ? colors.primary : colors.border.default,
                  backgroundColor: colors.surface,
                },
              ]}
              onPress={() => handleOptionChange(option.value)}
            >
              <View style={[styles.emojiContainer, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[TextStyles.body, { color: colors.text.primary }]}>
                  {option.emoji}
                </Text>
              </View>
              <View style={styles.optionLabel}>
                <Text style={[TextStyles.label, { color: colors.text.primary }]}>
                  {option.label}
                </Text>
                <Text style={[TextStyles.caption, { color: colors.text.secondary }]}>
                  {option.description}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {selectedOption === 'custom' && (
        <View style={{ flexDirection: 'column', gap: Spacing.sm, marginTop: Spacing.md }}>
          <Text style={[TextStyles.label, { color: colors.text.primary }]}>MEMBERS SPLIT</Text>

          {isLoadingMembers ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : members.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={[TextStyles.bodySmall, { color: colors.text.disabled }]}>
                No members found
              </Text>
            </View>
          ) : (
            <View
              style={[
                Card as ViewStyle,
                { backgroundColor: colors.surface, borderColor: colors.border.default },
              ]}
            >
              {members.map((member, index) => (
                <MemberCard
                  key={member.userId}
                  member={member}
                  index={index}
                  isLast={index === members.length - 1}
                  amount={memberAmounts[member.userId] ?? ''}
                  onAmountChange={handleAmountChange}
                />
              ))}

              {/* ── Remaining tracker ── */}
              <View style={[styles.remainingRow, { borderTopColor: colors.border.default }]}>
                {isPerfect ? (
                  <>
                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                    <Text style={[TextStyles.label, { color: colors.primary }]}>
                      Amount perfectly split
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={[TextStyles.label, { color: remainingColor }]}>
                      {isOver ? 'OVER BY' : 'REMAINING'}{' '}
                    </Text>
                    <Text style={[TextStyles.amountSmall, { color: remainingColor }]}>
                      {formatAmount(Math.abs(remaining))}
                    </Text>
                  </>
                )}
              </View>
            </View>
          )}

          {splitsError && (
            <Text style={[TextStyles.error, { color: colors.error }]}>{splitsError}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  splitOptionsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  splitOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  emojiContainer: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    flex: 1,
    flexDirection: 'column',
    gap: Spacing.xs,
  },
  amountInput: {
    ...Input,
    borderWidth: Border.thin,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minWidth: 80,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
    width: '100%',
    padding: Spacing.sm,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  remainingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
    borderTopWidth: Border.thin,
    paddingHorizontal: Spacing.sm,
  },
  loadingContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
