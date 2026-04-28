import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    addInputRef,
    addValue,
    setAddValue,
    addEmail,
    editingId,
    editingValue,
    setEditingValue,
    entries,
    isSending,
    startEdit,
    saveEdit,
    cancelEdit,
    removeEntry,
    handleInvite,
    handleDone,
  } = useInviteMembers();

  return (
    <ScreenContainer useScrollView={false}>
      <InviteMembersHeader onDone={handleDone} />

      {/* ── Add-new input row ────────────────────────────────────── */}
      <View
        style={[
          styles.inputRow,
          { backgroundColor: colors.surface, borderColor: colors.border.default },
        ]}
      >
        <TextInput
          ref={addInputRef}
          style={[styles.emailInput, { color: colors.text.primary }]}
          placeholder="Enter email address"
          placeholderTextColor={colors.text.disabled}
          value={addValue}
          onChangeText={setAddValue}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={addEmail}
        />
        <TouchableOpacity
          onPress={addEmail}
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={[TextStyles.label, { color: colors.onPrimary }]}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* ── Email list ───────────────────────────────────────────── */}
      {entries.length > 0 ? (
        <FlatList
          style={styles.list}
          data={entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const isEditing = editingId === item.id;
            return (
              <View
                style={[
                  styles.listItem,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isEditing ? colors.primary : colors.border.subtle,
                    borderWidth: isEditing ? 2 : Border.thin,
                  },
                ]}
              >
                <View style={[styles.avatar, { backgroundColor: colors.primaryContainer }]}>
                  <Text style={[TextStyles.label, { color: colors.onPrimaryContainer }]}>
                    {item.email[0].toUpperCase()}
                  </Text>
                </View>

                {isEditing ? (
                  <TextInput
                    style={[styles.inlineInput, { color: colors.text.primary }]}
                    value={editingValue}
                    onChangeText={setEditingValue}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={saveEdit}
                    autoFocus
                  />
                ) : (
                  <Text
                    style={[styles.emailText, TextStyles.body, { color: colors.text.primary }]}
                    numberOfLines={1}
                  >
                    {item.email}
                  </Text>
                )}

                {isEditing ? (
                  <>
                    <TouchableOpacity
                      onPress={saveEdit}
                      style={styles.iconBtn}
                      accessibilityLabel="Save email"
                    >
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={cancelEdit}
                      style={styles.iconBtn}
                      accessibilityLabel="Cancel edit"
                    >
                      <Ionicons name="close" size={20} color={colors.text.secondary} />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </View>
            );
          }}
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
  iconBtn: {
    padding: Spacing.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: Spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
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
  inlineInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Spacing.xs,
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
