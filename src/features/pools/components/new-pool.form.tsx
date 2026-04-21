import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useMemo } from 'react';
import { useController, UseFormReturn } from 'react-hook-form';
import { CreatePoolSchemaType } from '@/features/pools/pools.dto';
import { Radius, Spacing } from '@/core/common/constants/theme';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import useGroupsStore from '@/features/groups/groups.state';
import { Group } from '@/features/groups/groups.interface';
import MemberAvatar from '@/core/common/components/member-avatar';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import useProfile from '@/features/user/hooks/use-profile';
import CustomButton from '@/core/common/components/form/custom-button';

interface NewPoolFormProps {
  formController: UseFormReturn<CreatePoolSchemaType>;
  onCreatePool: () => Promise<void>;
}

export default function NewPoolForm({ formController, onCreatePool }: NewPoolFormProps) {
  const colors = useThemeColors();
  const { profile } = useProfile();
  const { selectedGroup } = useGroupsStore();

  const {
    field: { value: memberIds, onChange: onMemberIdsChange },
  } = useController({ name: 'memberIds', control: formController.control, defaultValue: [] });

  const membersOptions = useMemo(() => {
    return (selectedGroup as Group)?.members?.map((member) => ({
      label: member.name,
      value: member.userId,
      avatarUrl: member.avatarUrl,
    }));
  }, [selectedGroup]);

  const toggleMember = (userId: string) => {
    const current: string[] = memberIds ?? [];
    const updated = current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId];
    onMemberIdsChange(updated);
  };

  const memberIdsError = formController.formState.errors.memberIds;

  return (
    <View style={styles.formContainer}>
      <CustomTextInput
        label="TAB NAME"
        id="name"
        formController={formController}
        hint="e.g. January Bill, Ibadan Weekend, Office lunch"
        required
      />
      <View style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
        <Text style={[TextStyles.label, { color: colors.text.primary }]}>MEMBERS</Text>
        <View
          style={[
            styles.memberOptionContainer,
            { backgroundColor: colors.surface, borderColor: colors.border.default },
          ]}
        >
          {membersOptions?.map((option, index) => {
            const isSelected = (memberIds ?? []).includes(option.value);
            const isLast = index === (membersOptions?.length ?? 0) - 1;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.memberOption,
                  { borderColor: colors.border.default, borderBottomWidth: isLast ? 0 : 1 },
                ]}
                onPress={() => toggleMember(option.value)}
                activeOpacity={0.7}
              >
                <View
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}
                >
                  <MemberAvatar name={option.label} avatarUrl={option.avatarUrl} />
                  <Text style={[TextStyles.label, { color: colors.text.primary }]}>
                    {option.label.split(' ')[0]} {option.value === profile?.id && '(You)'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isSelected ? colors.primary : colors.border.default,
                      backgroundColor: isSelected ? colors.primary : 'transparent',
                    },
                  ]}
                >
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        {!memberIdsError ? (
          <Text style={[TextStyles.caption, { color: colors.text.disabled }]}>
            Inherits from the group. Uncheck to exclude.
          </Text>
        ) : (
          <Text style={{ color: colors.error, ...TextStyles.label }}>
            {memberIdsError?.message as string}
          </Text>
        )}
      </View>
      <CustomButton label={'Create Tab'} onPress={onCreatePool} />
    </View>
  );
}
const styles = StyleSheet.create({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.xl,
  },
  memberOptionContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  memberOption: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
});
