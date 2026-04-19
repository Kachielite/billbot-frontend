import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import useGroups from '@/features/groups/hooks/use-groups';
import SkeletonBox from '@/core/common/components/skeleton-box';
import EmptyState from '@/core/common/components/empty-state';
import { useNavigation } from '@react-navigation/native';
import { Group } from '@/features/groups/groups.interface';

// TODO: Remove once you create Groups
const GROUPS_MOCK: Group[] = [
  {
    id: '1',
    name: 'Family',
    description: 'A group for my family members',
    emoji: '👨‍👩‍👧',
    color: '#FF5733',
    inviteCode: 'FAMILY123',
    createdBy: 'user1',
    createdAt: new Date(),
    memberCount: 3,
    balance: { totalOwed: 50.0, totalOwedToMe: 20.0, netBalance: -30.0, currency: 'NGN' },
  },
  {
    id: '2',
    name: 'Friends',
    description: 'A group for my friends',
    emoji: '🎉',
    color: '#1E90FF',
    inviteCode: 'FRIENDS123',
    createdBy: 'user1',
    createdAt: new Date(),
    memberCount: 5,
    balance: { totalOwed: 0, totalOwedToMe: 75.5, netBalance: 75.5, currency: 'NGN' },
  },
  {
    id: '3',
    name: 'Work',
    description: 'A group for my work colleagues',
    emoji: '💼',
    color: '#32CD32',
    inviteCode: 'WORK123',
    createdBy: 'user1',
    createdAt: new Date(),
    memberCount: 8,
    balance: { totalOwed: 120.0, totalOwedToMe: 0, netBalance: -120.0, currency: 'NGN' },
  },
  {
    id: '4',
    name: 'Sports',
    description: 'A group for my sports team',
    emoji: null,
    color: null,
    inviteCode: 'SPORTS123',
    createdBy: 'user1',
    createdAt: new Date(),
    memberCount: 11,
    balance: { totalOwed: 0, totalOwedToMe: 0, netBalance: 0, currency: 'NGN' },
  },
];

const DEFAULT_EMOJI_BG = '#9370DB';

const GroupCard = ({ group }: { group: Group }) => {
  const colors = useThemeColors();
  const { totalOwed = 0, totalOwedToMe = 0, currency } = group.balance ?? {};
  const owedToMeIsGreatest = totalOwedToMe >= totalOwed;
  const amountLabel = owedToMeIsGreatest ? 'Owed to you' : 'You owe';
  const amountToDisplay = owedToMeIsGreatest ? totalOwedToMe : totalOwed;
  const prefix = owedToMeIsGreatest ? '+' : '-';
  const amountColor = owedToMeIsGreatest ? colors.primary : colors.error;
  const bgColor = group.color ?? DEFAULT_EMOJI_BG;

  return (
    <View
      style={[
        groupCardStyles.groupCard,
        { backgroundColor: colors.surface, borderColor: colors.border.subtle },
      ]}
    >
      <View style={[groupCardStyles.emojiContainer, { backgroundColor: bgColor }]}>
        <Text style={groupCardStyles.emoji}>{group.emoji ?? '👥'}</Text>
      </View>
      <View>
        <Text style={[TextStyles.label, { color: colors.text.primary }]}>{group.name}</Text>
        <Text style={[TextStyles.caption, { color: colors.text.secondary }]}>
          {group.memberCount} members
        </Text>
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
  );
};

const groupCardStyles = StyleSheet.create({
  groupCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    width: 170,
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
  const colors = useThemeColors();
  const nav: any = useNavigation();
  const { groups, isLoading: groupsLoading } = useGroups();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Your groups</Text>
        {groups.length > 0 ? (
          <Text style={[{ color: colors.onPrimaryContainer }]}>See All</Text>
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
