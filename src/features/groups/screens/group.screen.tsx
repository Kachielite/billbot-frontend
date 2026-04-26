import { Text } from 'react-native';
import React from 'react';
import type { StaticScreenProps } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import useGroupDetail from '@/features/groups/hooks/use-group-detail';
import useDeleteGroup from '@/features/groups/hooks/use-delete-group';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import GroupHeader from '@/features/groups/components/group.header';
import GroupInfo from '@/features/groups/components/group-info';
import GroupMembers from '@/features/groups/components/group-members';
import GroupTabs from '@/features/groups/components/group.tab';
import ConfirmDeleteModal from '@/core/common/components/confirm-delete-modal';
import ScreenLoader from '@/core/common/components/screen.loader';

type Props = StaticScreenProps<{ groupId: string; fromQuickActions?: boolean }>;

export default function GroupScreen({ route }: Props) {
  const { groupId } = route.params;
  const fromQuickActions = Boolean(route.params.fromQuickActions);
  const navigation = useNavigation();
  const { canGoBack, goBack, navigate } = navigation;
  const { group, isLoading } = useGroupDetail(groupId);
  const { deleteGroup, isDeleting } = useDeleteGroup();

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const hasHandledQuickAction = React.useRef(false);

  React.useEffect(() => {
    if (!fromQuickActions || isLoading || !group || hasHandledQuickAction.current) return;

    hasHandledQuickAction.current = true;
    navigate('NewPool', { groupId });
  }, [fromQuickActions, group, isLoading, navigate, groupId]);

  const handleConfirmDelete = async () => {
    await deleteGroup(groupId);
    setShowDeleteModal(false);
    if (canGoBack()) goBack();
  };

  if (isLoading) {
    return <ScreenLoader />;
  }

  if (!group) {
    return (
      <ScreenContainer>
        <Text>Group not found</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer useScrollView={false}>
      <GroupHeader
        groupId={groupId}
        members={group.members}
        onDeletePress={() => setShowDeleteModal(true)}
      />
      <GroupInfo group={group} />
      <GroupMembers members={group.members} />
      <GroupTabs groupId={groupId} />
      <ConfirmDeleteModal
        visible={showDeleteModal}
        icon="trash-outline"
        title="Delete group?"
        message="This will permanently delete the group and all its data. Members can always be re-added to a new group."
        confirmLabel="Delete"
        isLoading={isDeleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </ScreenContainer>
  );
}
