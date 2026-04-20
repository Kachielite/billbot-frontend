import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import type { StaticScreenProps } from '@react-navigation/native';
import useGroupDetail from '@/features/groups/hooks/use-group-detail';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import GroupHeader from '@/features/groups/components/group.header';
import GroupInfo from '@/features/groups/components/group-info';
import GroupMembers from '@/features/groups/components/group-members';
import GroupTabs from '@/features/groups/components/group.tab';

type Props = StaticScreenProps<{ groupId: string }>;

export default function GroupScreen({ route }: Props) {
  const { groupId } = route.params;
  const { isLoading, group } = useGroupDetail(groupId);

  if (!group) {
    return (
      <ScreenContainer>
        <Text>Group not found</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer useScrollView={false}>
      <GroupHeader groupId={groupId} />
      <GroupInfo group={group} />
      <GroupMembers members={group.members} />
      <GroupTabs groupId={groupId} />
    </ScreenContainer>
  );
}
