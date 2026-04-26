import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import BottomModal from '@/core/common/components/layout/bottom-modal';
import { TextStyles } from '@/core/common/constants/fonts';
import ManageMembersHeader from '@/features/groups/components/manage-members.header';
import useGroupDetail from '@/features/groups/hooks/use-group-detail';
import useCreateInvite from '@/features/invites/hooks/use-create-invite';
import useListInvites from '@/features/invites/hooks/use-list-invites';
import useCancelInvite from '@/features/invites/hooks/use-cancel-invite';
import useRemoveMember from '@/features/groups/hooks/use-remove-member';
import useUpdateMemberRole from '@/features/groups/hooks/use-update-member-role';
import useProfile from '@/features/user/hooks/use-profile';
import type { GroupMember } from '@/features/groups/groups.interface';
import type { Invite } from '@/features/invites/invites.interface';
import getInitials from '@/core/common/utils/get-initials';

const AVATAR_SIZE = 45;

interface PendingEntry {
  id: string;
  email: string;
}

// ── Draft row (unsent invite) ─────────────────────────────────────────────────
function PendingRow({
  entry,
  isLast,
  onRemove,
  onSave,
}: {
  entry: PendingEntry;
  isLast: boolean;
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
        styles.row,
        { borderColor: editing ? colors.primary : 'transparent', borderWidth: editing ? 2 : 0 },
        !isLast && { borderBottomWidth: editing ? 0 : 1, borderBottomColor: colors.border.default },
      ]}
    >
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

      <View style={styles.textStack}>
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
          <Text style={[TextStyles.bodySmall, { color: colors.text.primary }]} numberOfLines={1}>
            {entry.email}
          </Text>
        )}
        <View style={[styles.badge, { backgroundColor: colors.primaryContainer }]}>
          <Text style={[TextStyles.caption, { color: colors.onPrimaryContainer }]}>To invite</Text>
        </View>
      </View>

      {editing ? (
        <>
          <TouchableOpacity onPress={saveEdit} style={styles.iconBtn}>
            <Ionicons name="checkmark" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setEditing(false);
              setEditValue(entry.email);
            }}
            style={styles.iconBtn}
          >
            <Ionicons name="close" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => setEditing(true)} style={styles.iconBtn}>
            <Ionicons name="pencil-outline" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemove} style={styles.iconBtn}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// ── Server pending invite row ─────────────────────────────────────────────────
function ServerInviteRow({
  invite,
  isLast,
  onCancel,
  isCancelling,
}: {
  invite: Invite;
  isLast: boolean;
  onCancel: () => void;
  isCancelling: boolean;
}) {
  const colors = useThemeColors();
  const display = invite.email ?? invite.phone ?? 'Unknown';

  return (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border.default },
      ]}
    >
      <View
        style={[
          styles.avatar,
          { backgroundColor: colors.primaryContainer, borderColor: colors.surface },
        ]}
      >
        <Text style={[styles.initials, { color: colors.onPrimaryContainer }]}>
          {display[0].toUpperCase()}
        </Text>
      </View>

      <View style={styles.textStack}>
        <Text style={[TextStyles.bodySmall, { color: colors.text.primary }]} numberOfLines={1}>
          {display}
        </Text>
        <View style={[styles.badge, { backgroundColor: colors.primaryContainer }]}>
          <Text style={[TextStyles.caption, { color: colors.onPrimaryContainer }]}>Pending</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onCancel}
        disabled={isCancelling}
        style={[
          styles.cancelBtn,
          { borderColor: colors.error + '66', backgroundColor: colors.error + '14' },
        ]}
      >
        {isCancelling ? (
          <ActivityIndicator size="small" color={colors.error} />
        ) : (
          <Text style={[TextStyles.label, { color: colors.error }]}>Cancel</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ── Member row ────────────────────────────────────────────────────────────────
function MemberRow({
  member,
  colorIndex,
  isLast,
  onRemove,
  isRemoving,
  onEditRole,
  isSelf,
}: {
  member: GroupMember;
  colorIndex: number;
  isLast: boolean;
  onRemove: () => void;
  isRemoving: boolean;
  onEditRole: () => void;
  isSelf: boolean;
}) {
  const colors = useThemeColors();
  const swatch = colors.groupColors[colorIndex % colors.groupColors.length];

  return (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border.default },
      ]}
    >
      <View style={styles.rowInfo}>
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
        <View>
          <Text style={[TextStyles.bodyMedium, { color: colors.text.primary }]}>{member.name}</Text>
          <Text
            style={[
              TextStyles.caption,
              { color: colors.text.secondary, textTransform: 'uppercase' },
            ]}
          >
            {member.role}
          </Text>
        </View>
      </View>

      {!isSelf && (
        <View style={styles.rowActions}>
          <TouchableOpacity onPress={onEditRole} style={styles.iconBtn} disabled={false}>
            <FontAwesome5 name="user-edit" size={16} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemove} disabled={isRemoving} style={styles.iconBtn}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ── Section empty placeholder ─────────────────────────────────────────────────
function SectionEmpty({ message }: { message: string }) {
  const colors = useThemeColors();
  return (
    <View style={styles.sectionEmpty}>
      <Text style={[TextStyles.bodySmall, { color: colors.text.disabled, textAlign: 'center' }]}>
        {message}
      </Text>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function ManageMembersScreen() {
  const route = useRoute() as any;
  const groupId: string = route.params?.groupId;

  const colors = useThemeColors();
  const { group } = useGroupDetail(groupId);
  const { createInvite, isInviting } = useCreateInvite(groupId);
  const { invites } = useListInvites(groupId);
  const { cancelInvite, isCancelling } = useCancelInvite(groupId);
  const { removeMember, isRemoving } = useRemoveMember();
  const { updateMemberRole, isUpdatingRole } = useUpdateMemberRole(groupId);
  const { profile } = useProfile();

  // ── Draft invite state ────────────────────────────────────────────────────
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
  const updatePending = (id: string, email: string) =>
    setPendingInvites((prev) => prev.map((e) => (e.id === id ? { ...e, email } : e)));

  const sendInvites = async () => {
    for (const entry of pendingInvites) await createInvite({ email: entry.email });
    setPendingInvites([]);
  };

  // ── Remove member ─────────────────────────────────────────────────────────
  const [memberToRemove, setMemberToRemove] = useState<GroupMember | null>(null);

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;
    await removeMember({ groupId, userId: memberToRemove.userId });
    setMemberToRemove(null);
  };

  // ── Role edit modal ───────────────────────────────────────────────────────
  const [roleEditMember, setRoleEditMember] = useState<GroupMember | null>(null);

  const handleRoleSelect = async (role: 'admin' | 'member') => {
    if (!roleEditMember || role === roleEditMember.role) {
      setRoleEditMember(null);
      return;
    }
    await updateMemberRole({ userId: roleEditMember.userId, role });
    setRoleEditMember(null);
  };

  const members: GroupMember[] = group?.members ?? [];
  const pendingServerInvites = invites.filter((i) => i.status === 'pending');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenContainer useScrollView={false}>
        <ManageMembersHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Invite input ── */}
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

          {/* ── Draft "To be invited" section ── */}
          {pendingInvites.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Text
                  style={[TextStyles.label, { color: colors.text.secondary, letterSpacing: 0.8 }]}
                >
                  TO BE INVITED · {pendingInvites.length}
                </Text>
                <TouchableOpacity onPress={sendInvites} disabled={isInviting}>
                  <Text
                    style={[
                      TextStyles.label,
                      { color: isInviting ? colors.text.disabled : colors.primary },
                    ]}
                  >
                    {isInviting ? 'Sending…' : 'Send invites'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.surface, borderColor: colors.border.default },
                ]}
              >
                {pendingInvites.map((entry, index) => (
                  <PendingRow
                    key={entry.id}
                    entry={entry}
                    isLast={index === pendingInvites.length - 1}
                    onRemove={() => removePending(entry.id)}
                    onSave={(email) => updatePending(entry.id, email)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* ── Current Members section ── */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text
                style={[TextStyles.label, { color: colors.text.secondary, letterSpacing: 0.8 }]}
              >
                CURRENT MEMBERS · {members.length}
              </Text>
            </View>
            <View
              style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border.default },
              ]}
            >
              {members.length === 0 ? (
                <SectionEmpty message="No members yet." />
              ) : (
                members.map((member, index) => (
                  <MemberRow
                    key={member.userId}
                    member={member}
                    colorIndex={index}
                    isLast={index === members.length - 1}
                    onRemove={() => setMemberToRemove(member)}
                    isRemoving={isRemoving}
                    onEditRole={() => setRoleEditMember(member)}
                    isSelf={!!profile && member.userId === profile.id}
                  />
                ))
              )}
            </View>
          </View>

          {/* ── Pending Invites section ── */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text
                style={[TextStyles.label, { color: colors.text.secondary, letterSpacing: 0.8 }]}
              >
                PENDING INVITES · {pendingServerInvites.length}
              </Text>
            </View>
            <View
              style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border.default },
              ]}
            >
              {pendingServerInvites.length === 0 ? (
                <SectionEmpty message="No pending invites." />
              ) : (
                pendingServerInvites.map((invite, index) => (
                  <ServerInviteRow
                    key={invite.id}
                    invite={invite}
                    isLast={index === pendingServerInvites.length - 1}
                    onCancel={() => cancelInvite(invite.id)}
                    isCancelling={isCancelling}
                  />
                ))
              )}
            </View>
          </View>
        </ScrollView>

        {/* ── Remove member confirmation ── */}
        <ConfirmDeleteModal
          visible={!!memberToRemove}
          onCancel={() => setMemberToRemove(null)}
          onConfirm={handleConfirmRemove}
          isLoading={isRemoving}
          title="Remove member?"
          message={
            memberToRemove ? `Are you sure you want to remove ${memberToRemove.name}?` : undefined
          }
        />

        {/* ── Role edit bottom modal ── */}
        <BottomModal visible={!!roleEditMember} onCancel={() => setRoleEditMember(null)}>
          <View style={styles.roleSheet}>
            <Text style={[TextStyles.headingSmall, { color: colors.text.primary }]}>EDIT ROLE</Text>
            {roleEditMember && (
              <Text style={[TextStyles.bodySmall, { color: colors.text.secondary }]}>
                {roleEditMember.name}
              </Text>
            )}
            <View style={[styles.roleOptions, { borderColor: colors.border.default }]}>
              {(['member', 'admin'] as const).map((role, index, arr) => {
                const active = roleEditMember?.role === role;
                return (
                  <TouchableOpacity
                    key={role}
                    onPress={() => handleRoleSelect(role)}
                    disabled={isUpdatingRole}
                    style={[
                      styles.roleOption,
                      active && { backgroundColor: colors.primaryContainer },
                      index < arr.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border.default,
                      },
                    ]}
                  >
                    <Ionicons
                      name={role === 'admin' ? 'shield-checkmark-outline' : 'person-outline'}
                      size={18}
                      color={active ? colors.primary : colors.text.secondary}
                    />
                    <Text
                      style={[
                        TextStyles.bodyMedium,
                        {
                          color: active ? colors.primary : colors.text.primary,
                          textTransform: 'capitalize',
                          flex: 1,
                        },
                      ]}
                    >
                      {role}
                    </Text>
                    {isUpdatingRole && active ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : active ? (
                      <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </BottomModal>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
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
  section: {
    gap: Spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: Border.thin,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  rowInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  textStack: {
    flex: 1,
    flexDirection: 'column',
    gap: 3,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  cancelBtn: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minWidth: 64,
    alignItems: 'center',
  },
  iconBtn: { padding: Spacing.sm },
  sectionEmpty: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  // Role modal
  roleSheet: {
    width: '100%',
    gap: Spacing.md,
  },
  roleOptions: {
    borderRadius: Radius.lg,
    borderWidth: Border.thin,
    overflow: 'hidden',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
});
