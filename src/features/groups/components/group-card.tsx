import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import React from 'react';
import { Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { useNavigation } from '@react-navigation/native';
import { Group } from '@/features/groups/groups.interface';
import useGroupsStore from '@/features/groups/groups.state';

const DEFAULT_EMOJI_BG = '#9370DB';

const GroupCard = ({ group }: { group: Group }) => {
  const navigation = useNavigation() as any;
  const scheme = useColorScheme();
  const colors = useThemeColors();
  const { setSelectedGroup } = useGroupsStore();
  const { totalOwed = 0, totalOwedToMe = 0, currency } = group.balance ?? {};
  const owedToMeIsGreatest = totalOwedToMe >= totalOwed;
  const amountLabel = owedToMeIsGreatest ? 'Owed to you' : 'You owe';
  const amountToDisplay = owedToMeIsGreatest ? totalOwedToMe : totalOwed;
  const prefix = owedToMeIsGreatest ? '+' : '-';
  const amountColor = owedToMeIsGreatest ? colors.primary : colors.error;
  const bgColor = group.color ?? DEFAULT_EMOJI_BG;
  const iconBackgroundOpacity = scheme === 'dark' ? '80' : '40';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => {
        setSelectedGroup(group);
        navigation.navigate('Group', { groupId: group.id });
      }}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border.subtle },
        ]}
      >
        {/* left — icon + name */}
        <View style={styles.left}>
          <View
            style={[styles.emojiContainer, { backgroundColor: bgColor + iconBackgroundOpacity }]}
          >
            <Text style={styles.emoji}>{group.emoji ?? '👥'}</Text>
          </View>
          <View style={styles.nameBlock}>
            <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]} numberOfLines={1}>
              {group.name}
            </Text>
            <Text style={[TextStyles.caption, { color: colors.text.secondary }]}>
              {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}
              {group.activePoolCount > 0 ? ` · ${group.activePoolCount} active` : ''}
            </Text>
          </View>
        </View>

        {/* right — balance */}
        <View style={styles.right}>
          <Text style={[TextStyles.amountMedium, { color: amountColor }]}>
            {prefix} {currency ?? ''}{' '}
            {amountToDisplay.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text style={[TextStyles.caption, { color: colors.text.secondary }]}>{amountLabel}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GroupCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  nameBlock: {
    flex: 1,
    gap: 2,
  },
  emojiContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
});
