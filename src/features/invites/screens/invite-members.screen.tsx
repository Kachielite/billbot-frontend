import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import InviteMembersHeader from '@/features/invites/components/invite-members.header';
import useInviteMembers from '@/features/invites/hooks/use-invite-members';

export default function InviteMembersScreen() {
  const colors = useThemeColors();
  const {
    inputRef,
    inputValue,
    setInputValue,
    editingId,
    entries,
    isSending,
    addOrUpdateEmail,
    startEdit,
    cancelEdit,
    removeEntry,
    handleInvite,
    handleDone,
  } = useInviteMembers();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenContainer>
        <InviteMembersHeader onDone={handleDone} />

        {/* ── Email input row ──────────────────────────────────────── */}
        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: colors.surface,
              borderColor: editingId ? colors.primary : colors.border.default,
              borderWidth: editingId ? 2 : Border.thin,
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            style={[styles.emailInput, { color: colors.text.primary }]}
            placeholder="Enter email address"
            placeholderTextColor={colors.text.disabled}
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={addOrUpdateEmail}
          />
          {editingId ? (
            <View style={styles.inputActions}>
              <TouchableOpacity onPress={cancelEdit} style={styles.iconBtn}>
                <Ionicons name="close" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addOrUpdateEmail}
                style={[styles.addBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={[TextStyles.label, { color: colors.onPrimary }]}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={addOrUpdateEmail}
              style={[styles.addBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={[TextStyles.label, { color: colors.onPrimary }]}>Add</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Email list ───────────────────────────────────────────── */}
        {entries.length > 0 ? (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.listItem,
                  {
                    backgroundColor: colors.surface,
                    borderColor: editingId === item.id ? colors.primary : colors.border.subtle,
                  },
                ]}
              >
                <View style={[styles.avatar, { backgroundColor: colors.primaryContainer }]}>
                  <Text style={[TextStyles.label, { color: colors.onPrimaryContainer }]}>
                    {item.email[0].toUpperCase()}
                  </Text>
                </View>
                <Text
                  style={[styles.emailText, TextStyles.body, { color: colors.text.primary }]}
                  numberOfLines={1}
                >
                  {item.email}
                </Text>
                <TouchableOpacity
                  onPress={() => startEdit(item)}
                  style={styles.iconBtn}
                  accessibilityLabel="Edit email"
                >
                  <Ionicons name="pencil-outline" size={18} color={colors.text.secondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeEntry(item.id)}
                  style={styles.iconBtn}
                  accessibilityLabel="Remove email"
                >
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="mail-outline" size={40} color={colors.text.disabled} />
            <Text style={[TextStyles.body, { color: colors.text.disabled, textAlign: 'center' }]}>
              Add email addresses above to invite people to your group.
            </Text>
          </View>
        )}

        {/* ── Invite button ────────────────────────────────────────── */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleInvite}
            disabled={isSending || entries.length === 0}
            style={[
              styles.inviteBtn,
              { backgroundColor: colors.primary },
              (isSending || entries.length === 0) && { opacity: 0.5 },
            ]}
          >
            <Ionicons name="paper-plane-outline" size={20} color={colors.onPrimary} />
            <Text style={[TextStyles.button, { color: colors.onPrimary }]}>
              {isSending
                ? 'Sending…'
                : `Invite ${entries.length > 0 ? `${entries.length} ` : ''}member${entries.length !== 1 ? 's' : ''}`}
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
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
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  addBtn: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  iconBtn: {
    padding: Spacing.sm,
  },
  listContent: {
    gap: Spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: Border.thin,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Shadow.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailText: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  footer: {
    paddingTop: Spacing.sm,
  },
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
