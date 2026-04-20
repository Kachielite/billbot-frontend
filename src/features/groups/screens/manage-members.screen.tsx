import React, { useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRoute } from '@react-navigation/native';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import ConfirmDeleteModal from '@/core/common/components/confirm-delete-modal';
import { TextStyles } from '@/core/common/constants/fonts';
import ManageMembersHeader from '@/features/groups/components/manage-members.header';
import useGroupDetail from '@/features/groups/hooks/use-group-detail';
import useCreateInvite from '@/features/invites/hooks/use-create-invite';
import useRemoveMember from '@/features/groups/hooks/use-remove-member';
import useUpdateMemberRole from '@/features/groups/hooks/use-update-member-role';
import type { GroupMember } from '@/features/groups/groups.interface';
import getInitials from '@/core/common/utils/get-initials';

const AVATAR_SIZE = 45;

// ── Pending invite entry (local state before sending) ────────────────────────
interface PendingEntry {
  id: string;
  email: string;
}

// ── Pending row ───────────────────────────────────────────────────────────────
function PendingRow({
  entry,
  onRemove,
  onSave,
}: {
  entry: PendingEntry;
  onRemove: () => void;
  onSave: (newEmail: string) => void;
}) {
  const colors = useThemeColors();
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(entry.email);

  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed) onSave(trimmed);
    setEditing(false);
  };

  return (
    <View
      style={[
        styles.memberContainer,
        {
          backgroundColor: colors.surface,
          borderColor: editing ? colors.primary : colors.border.subtle,
          borderWidth: editing ? 2 : Border.thin,
        },
      ]}
    >
      {/* avatar initial */}
      <View
        style={[
          styles.avatar,
          { backgroundColor: colors.primaryContainer, borderColor: colors.surface },
        ]}
      >
        <Text style={[styles.initials, { color: colors.onPrimaryContainer }]}>
          {entry.email[0].toUpperCase()}
        </Text>
      </View>

      {/* email / inline input */}
      <View style={styles.memberInfo}>
        {editing ? (
          <TextInput
            style={[styles.inlineInput, { color: colors.text.primary }]}
            value={editValue}
            onChangeText={setEditValue}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={saveEdit}
            autoFocus
          />
        ) : (
          <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]} numberOfLines={1}>
            {entry.email}
          </Text>
        )}
        <View style={[styles.statusBadge, { backgroundColor: colors.primaryContainer }]}>
          <Text style={[TextStyles.caption, { color: colors.onPrimaryContainer }]}>Pending</Text>
        </View>
      </View>

      {/* actions */}
      {editing ? (
        <>
          <TouchableOpacity onPress={saveEdit} style={styles.iconBtn} accessibilityLabel="Save">
            <Ionicons name="checkmark" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setEditing(false);
              setEditValue(entry.email);
            }}
            style={styles.iconBtn}
            accessibilityLabel="Cancel edit"
          >
            <Ionicons name="close" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setEditing(true)}
            style={styles.iconBtn}
            accessibilityLabel="Edit invite"
          >
            <Ionicons name="pencil-outline" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onRemove}
            style={styles.iconBtn}
            accessibilityLabel="Remove invite"
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// ── Member row (MemberCard style + role edit) ────────────────────────────────
function MemberRow({
  member,
  index,
  onRemove,
  isRemoving,
  onRoleChange,
  isUpdatingRole,
}: {
  member: GroupMember;
  index: number;
  onRemove: () => void;
  isRemoving: boolean;
  onRoleChange: (role: 'admin' | 'member') => void;
  isUpdatingRole: boolean;
}) {
  const colors = useThemeColors();
  const swatch = colors.groupColors[index % colors.groupColors.length];
  const [showRolePicker, setShowRolePicker] = useState(false);

  const handleRoleSelect = (role: 'admin' | 'member') => {
    setShowRolePicker(false);
    if (role !== member.role) onRoleChange(role);
  };

  return (
    <View>
      <View style={[styles.memberContainer, { backgroundColor: colors.surface, borderWidth: 0 }]}>
        {/* avatar */}
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
              <Text style={[styles.initials, { color: swatch.on }]}>
                {getInitials(member.name)}
              </Text>
            </View>
          )}
          <View>
            <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>
              {member.name}
            </Text>
            <Text
              style={[
                TextStyles.caption,
                { color: colors.text.primary, textTransform: 'uppercase' },
              ]}
            >
              {member.role}
            </Text>
          </View>
        </View>

        {/* actions */}
        <View style={styles.rowActions}>
          <TouchableOpacity
            onPress={() => setShowRolePicker((v) => !v)}
            disabled={isUpdatingRole}
            style={styles.iconBtn}
            accessibilityLabel="Edit role"
          >
            <FontAwesome5
              name="user-edit"
              size={16}
              color={showRolePicker ? colors.primary : colors.text.secondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onRemove}
            disabled={isRemoving}
            style={styles.iconBtn}
            accessibilityLabel="Remove member"
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* inline role picker */}
      {showRolePicker && (
        <View
          style={[
            styles.rolePicker,
            { backgroundColor: colors.surface, borderColor: colors.border.subtle },
          ]}
        >
          {(['member', 'admin'] as const).map((role) => {
            const active = member.role === role;
            return (
              <TouchableOpacity
                key={role}
                onPress={() => handleRoleSelect(role)}
                style={[styles.roleOption, active && { backgroundColor: colors.primaryContainer }]}
              >
                <Ionicons
                  name={role === 'admin' ? 'shield-checkmark-outline' : 'person-outline'}
                  size={16}
                  color={active ? colors.onPrimaryContainer : colors.text.secondary}
                />
                <Text
                  style={[
                    TextStyles.bodySmall,
                    {
                      color: active ? colors.onPrimaryContainer : colors.text.primary,
                      textTransform: 'capitalize',
                    },
                  ]}
                >
                  {role}
                </Text>
                {active && (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color={colors.onPrimaryContainer}
                    style={{ marginLeft: 'auto' }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default function ManageMembersScreen() {
  const route = useRoute() as any;
  const groupId: string = route.params?.groupId;

  const colors = useThemeColors();
  const { group } = useGroupDetail(groupId);
  const { createInvite, isInviting } = useCreateInvite(groupId);
  const { removeMember, isRemoving } = useRemoveMember();
  const { updateMemberRole, isUpdatingRole } = useUpdateMemberRole(groupId);

  // ── invite input ─────────────────────────────────────────────────────────
  const addInputRef = useRef<TextInput>(null);
  const [addValue, setAddValue] = useState('');
  const [pendingInvites, setPendingInvites] = useState<PendingEntry[]>([]);

  const addToPending = () => {
    const trimmed = addValue.trim();
    if (!trimmed) return;
    if (pendingInvites.some((e) => e.email === trimmed)) {
      setAddValue('');
      return;
    }
    setPendingInvites((prev) => [...prev, { id: Date.now().toString(), email: trimmed }]);
    setAddValue('');
  };

  const removePending = (id: string) =>
    setPendingInvites((prev) => prev.filter((e) => e.id !== id));

  const updatePending = (id: string, newEmail: string) =>
    setPendingInvites((prev) => prev.map((e) => (e.id === id ? { ...e, email: newEmail } : e)));

  const sendInvites = async () => {
    for (const entry of pendingInvites) await createInvite({ email: entry.email });
    setPendingInvites([]);
  };

  // ── remove current member ────────────────────────────────────────────────
  const [memberToRemove, setMemberToRemove] = useState<GroupMember | null>(null);

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;
    await removeMember({ groupId, userId: memberToRemove.userId });
    setMemberToRemove(null);
  };

  const members: GroupMember[] = group?.members ?? [];

  // ── SectionList data ─────────────────────────────────────────────────────
  type RowItem = (PendingEntry & { _kind: 'pending' }) | (GroupMember & { _kind: 'member' });
  type Section = { key: string; title: string; data: RowItem[] };

  const pendingRows: RowItem[] = pendingInvites.map((e) => ({ ...e, _kind: 'pending' as const }));
  const memberRows: RowItem[] = members.map((m) => ({ ...m, _kind: 'member' as const }));

  const sections: Section[] = [
    ...(pendingRows.length > 0
      ? [{ key: 'pending', title: `To be invited · ${pendingRows.length}`, data: pendingRows }]
      : []),
    { key: 'members', title: `Current members · ${memberRows.length}`, data: memberRows },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenContainer useScrollView={false}>
        <ManageMembersHeader />

        {/* ── Add / invite input ───────────────────────────────────── */}
        <View
          style={[
            styles.inputRow,
            { backgroundColor: colors.surface, borderColor: colors.border.default },
          ]}
        >
          <TextInput
            ref={addInputRef}
            style={[styles.emailInput, { color: colors.text.primary }]}
            placeholder="Enter email to invite"
            placeholderTextColor={colors.text.disabled}
            value={addValue}
            onChangeText={setAddValue}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={addToPending}
          />
          <TouchableOpacity
            onPress={addToPending}
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[TextStyles.label, { color: colors.onPrimary }]}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* ── Two-section list ─────────────────────────────────────── */}
        <SectionList
          style={styles.list}
          sections={sections}
          keyExtractor={(item) => (item._kind === 'member' ? item.userId : item.id)}
          stickySectionHeadersEnabled={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          renderSectionHeader={({ section }) => (
            <Text
              style={[TextStyles.label, styles.sectionHeader, { color: colors.text.secondary }]}
            >
              {section.title.toUpperCase()}
            </Text>
          )}
          renderItem={({ item, index }) => {
            if (item._kind === 'pending') {
              return (
                <PendingRow
                  entry={item}
                  onRemove={() => removePending(item.id)}
                  onSave={(newEmail) => updatePending(item.id, newEmail)}
                />
              );
            }
            return (
              <MemberRow
                member={item}
                index={index}
                onRemove={() => setMemberToRemove(item)}
                isRemoving={isRemoving}
                onRoleChange={(role) => updateMemberRole({ userId: item.userId, role })}
                isUpdatingRole={isUpdatingRole}
              />
            );
          }}
          renderSectionFooter={({ section }) =>
            section.key === 'members' ? (
              <View style={[styles.cardWrapper, { backgroundColor: colors.surface }]} />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={40} color={colors.text.disabled} />
              <Text style={[TextStyles.body, { color: colors.text.disabled, textAlign: 'center' }]}>
                No members yet.
              </Text>
            </View>
          }
        />

        {/* ── Remove member modal ──────────────────────────────────── */}
        <ConfirmDeleteModal
          visible={!!memberToRemove}
          onCancel={() => setMemberToRemove(null)}
          onConfirm={handleConfirmRemove}
          isLoading={isRemoving}
          title="Remove member?"
          message={
            memberToRemove
              ? `Are you sure you want to remove ${memberToRemove.name || memberToRemove.email}?`
              : undefined
          }
        />

        {/* ── Send invites button ──────────────────────────────────── */}
        {pendingInvites.length > 0 && (
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={sendInvites}
              disabled={isInviting}
              style={[
                styles.inviteBtn,
                { backgroundColor: colors.primary },
                isInviting && { opacity: 0.5 },
              ]}
            >
              <Ionicons name="paper-plane-outline" size={20} color={colors.onPrimary} />
              <Text style={[TextStyles.button, { color: colors.onPrimary }]}>
                {isInviting
                  ? 'Sending…'
                  : `Send ${pendingInvites.length} invite${pendingInvites.length !== 1 ? 's' : ''}`}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: Border.thin,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  emailInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
  },
  addBtn: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  list: { flex: 1 },
  listContent: { gap: Spacing.xs, paddingBottom: Spacing.md },
  sectionHeader: {
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  // MemberCard-style row (matches group-members.tsx)
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
    width: '100%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    ...Shadow.sm,
  },
  memberInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
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
  inlineInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Spacing.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginTop: 2,
  },
  iconBtn: { padding: Spacing.sm },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rolePicker: {
    marginTop: 2,
    marginHorizontal: Spacing.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  cardWrapper: { borderRadius: Radius.md },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
  },
  footer: { paddingTop: Spacing.sm },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 52,
    borderRadius: Radius.full,
    ...Shadow.md,
  },
});
