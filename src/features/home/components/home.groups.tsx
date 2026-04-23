import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import React from 'react';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import useGroups from '@/features/groups/hooks/use-groups';
import SkeletonBox from '@/core/common/components/skeleton-box';
import EmptyState from '@/core/common/components/empty-state';
import { useNavigation } from '@react-navigation/native';
import { Group } from '@/features/groups/groups.interface';

const DEFAULT_EMOJI_BG = '#9370DB';

const GroupCard = ({ group }: { group: Group }) => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const colors = useThemeColors();
  const { totalOwed = 0, totalOwedToMe = 0, currency } = group.balance ?? {};
  const owedToMeIsGreatest = totalOwedToMe >= totalOwed;
  const amountLabel = owedToMeIsGreatest ? 'Owed to you' : 'You owe';
  const amountToDisplay = owedToMeIsGreatest ? totalOwedToMe : totalOwed;
  const prefix = owedToMeIsGreatest ? '+' : '-';
  const amountColor = owedToMeIsGreatest ? colors.primary : colors.error;
  const bgColor = group.color ?? DEFAULT_EMOJI_BG;
  const iconBackgroundOpacity = scheme === 'dark' ? '80' : '40';

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Group', { groupId: group.id })}>
      <View
        style={[
          groupCardStyles.groupCard,
          { backgroundColor: colors.surface, borderColor: colors.border.subtle },
        ]}
      >
        <View style={groupCardStyles.groupInfoContainer}>
          <View
            style={[
              groupCardStyles.emojiContainer,
              { backgroundColor: bgColor + iconBackgroundOpacity },
            ]}
          >
            <Text style={groupCardStyles.emoji}>{group.emoji ?? '👥'}</Text>
          </View>
          <View>
            <Text style={[TextStyles.label, { color: colors.text.primary }]}>{group.name}</Text>
            <Text style={[TextStyles.caption, { color: colors.text.secondary }]}>
              {group.memberCount} members
            </Text>
          </View>
        </View>
        <View>
          <Text style={[TextStyles.amountMedium, { color: amountColor }]}>
            {prefix} {currency}{' '}
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

const groupCardStyles = StyleSheet.create({
  groupCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    minWidth: 170,
  },
  groupInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: Spacing.sm,
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
});

export default function HomeGroups() {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const nav: any = useNavigation();
  const { groups, isLoading: groupsLoading } = useGroups();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Your groups</Text>
        {groups.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Tabs', { screen: 'Groups' });
            }}
          >
            <Text style={[TextStyles.label, { color: colors.primary }]}>See all</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {groupsLoading ? (
        <View style={{ flexDirection: 'row', paddingVertical: Spacing.sm }}>
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBox key={i} width={170} height={110} bg={colors.surface} />
          ))}
        </View>
      ) : groups.length === 0 ? (
        <EmptyState
          title="No groups yet"
          subtitle="Create your first group to start tracking shared expenses."
          actionLabel="Create group"
          onAction={() => {
            nav.navigate('NewGroup');
          }}
        />
      ) : (
        <FlatList
          data={groups}
          renderItem={({ item }) => <GroupCard group={item} />}
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
  seeMoreBtn: {},
});
