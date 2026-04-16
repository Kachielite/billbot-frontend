import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import useGroups from '@/features/groups/hooks/use-groups';
import { Group } from '@/features/groups/groups.interface';
import { LiquidGlassContainerView } from '@callstack/liquid-glass';
import { GlassContainer } from 'expo-glass-effect';

// TODO: Remove once you create Groups
const GROUPS_MOCK: Group[] = [
  {
    id: '1',
    name: 'Family',
    description: 'A group for my family members',
    inviteCode: 'FAMILY123',
    createdBy: 'user1',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Friends',
    description: 'A group for my friends',
    inviteCode: 'FRIENDS123',
    createdBy: 'user1',
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Work',
    description: 'A group for my work colleagues',
    inviteCode: 'WORK123',
    createdBy: 'user1',
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Sports',
    description: 'A group for my sports team',
    inviteCode: 'SPORTS123',
    createdBy: 'user1',
    createdAt: new Date(),
  },
];

const GroupCard = ({ group }: { group: Group }) => {
  const colors = useThemeColors();
  return (
    <View
      style={[
        groupCardStyles.groupCard,
        { backgroundColor: colors.surface, borderColor: colors.border.subtle },
      ]}
    >
      <View>
        <Text style={[TextStyles.label, { color: colors.text.primary }]}>{group.name}</Text>
        <Text style={[TextStyles.caption]}>3 members</Text>
      </View>
    </View>
  );
};

const groupCardStyles = StyleSheet.create({
  groupCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    width: 170,
  },
});

export default function HomeGroups() {
  const colors = useThemeColors();
  // const {groups} = useGroups();
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[TextStyles.subtitle, { color: colors.text.primary }]}>Your groups</Text>
        <Text style={[{ color: colors.onPrimaryContainer }]}>See All</Text>
      </View>
      <FlatList
        data={GROUPS_MOCK}
        renderItem={({ item }) => <GroupCard group={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: Spacing.md,
          paddingVertical: Spacing.sm,
        }}
      />
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
