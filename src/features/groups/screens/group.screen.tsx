import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import type { StaticScreenProps } from '@react-navigation/native';
import useGroupDetail from '@/features/groups/hooks/use-group-detail';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import GroupHeader from '@/features/groups/components/group.header';

type Props = StaticScreenProps<{ groupId: string }>;

export default function GroupScreen({ route }: Props) {
  const { groupId } = route.params;
  const { isLoading, group } = useGroupDetail(groupId);

  console.log('group', group);

  if (!group) {
    return (
      <ScreenContainer>
        <Text>Group not found</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <GroupHeader groupName={group?.name} memberCount={group?.members.length} />
    </ScreenContainer>
  );
}
