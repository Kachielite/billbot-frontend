import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useCreateGroup from '../hooks/use-create-group';
import NewGroupHeader from '@/features/groups/components/new-group.header';
import GroupIconSelector from '@/features/groups/components/group-icon-selector';
import useEmojiIconsStore from '@/features/groups/emoji-icons.state';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function NewGroupScreen() {
  const navigation = useNavigation() as any;
  const scheme = useColorScheme();
  const colors = useThemeColors();
  const { form, isCreating, createGroup } = useCreateGroup();
  const { icons, setIcons } = useEmojiIconsStore();

  const groupColors = colors.groupColors;
  const [selectedIcon, setSelectedIcon] = useState(icons[0] ?? '🏠');
  const [selectedColor, setSelectedColor] = useState(groupColors[0].fill);
  const iconBackgroundOpacity = scheme === 'dark' ? '80' : '40';

  // Keep emoji + color fields in sync with the form
  useEffect(() => {
    form.setValue('emoji', selectedIcon, { shouldValidate: true });
  }, [selectedIcon]);
  useEffect(() => {
    form.setValue('color', selectedColor, { shouldValidate: true });
  }, [selectedColor]);

  const groupName = form.watch('name');

  const handleContinue = form.handleSubmit(async (data) => {
    const group = await createGroup({
      ...data,
      emoji: selectedIcon,
      color: selectedColor,
    });
    navigation.navigate('InviteMembers', { groupId: group.id });
  });

  return (
    <ScreenContainer useScrollView>
      <NewGroupHeader />
      {/* ── Preview ────────────────────────────────────────────────── */}
      <View style={styles.previewContainer}>
        <View
          style={[styles.iconPreview, { backgroundColor: selectedColor + iconBackgroundOpacity }]}
        >
          <Text style={styles.iconPreviewEmoji}>{selectedIcon}</Text>
        </View>
        <Text style={[TextStyles.headingSmall, { color: colors.text.primary }]}>
          {groupName || 'Group name'}
        </Text>
        <Text style={[TextStyles.caption, { color: colors.text.secondary }]}>Preview</Text>
      </View>

      {/* ── Group Name ─────────────────────────────────────────────── */}
      <View style={styles.section}>
        <CustomTextInput
          label="GROUP NAME"
          id="name"
          formController={form}
          hint="e.g. Family, Lagos Trip, Office lunch"
          required
        />
      </View>

      {/* ── Description ────────────────────────────────────────────── */}
      <View style={styles.section}>
        <CustomTextInput
          label="DESCRIPTION (optional)"
          id="description"
          formController={form}
          placeholder="What's this group for?"
        />
      </View>

      {/* ── Icon selector ──────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, TextStyles.label, { color: colors.text.secondary }]}>
          ICON
        </Text>
        <GroupIconSelector
          icons={icons}
          selectedIcon={selectedIcon}
          selectedColor={selectedColor}
          onIconsChange={setIcons}
          onSelectIcon={setSelectedIcon}
        />
      </View>

      {/* ── Color selector ─────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, TextStyles.label, { color: colors.text.secondary }]}>
          COLOR
        </Text>
        <View style={styles.colorRow}>
          {groupColors.map((swatch) => {
            const isSelected = selectedColor === swatch.fill;
            return (
              <TouchableOpacity
                key={swatch.fill}
                onPress={() => setSelectedColor(swatch.fill)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: swatch.fill },
                  isSelected && styles.colorCircleSelected,
                ]}
              >
                {isSelected && <Ionicons name="checkmark" size={18} color={swatch.on} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Continue button ────────────────────────────────────────── */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={isCreating}
          style={[styles.continueBtn, { backgroundColor: colors.primary }]}
        >
          <AntDesign name="user-add" size={24} color={colors.text.inverse} />
          <Text style={[TextStyles.button, { color: colors.onPrimary }]}>
            Continue · invite members
          </Text>
        </TouchableOpacity>
        <Text style={[TextStyles.caption, { color: colors.text.secondary, textAlign: 'center' }]}>
          Members come next. Groups hold your tabs — monthly
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  headerCenter: {
    alignItems: 'center',
    gap: 2,
  },
  previewContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  iconPreview: {
    width: 80,
    height: 80,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  iconPreviewEmoji: {
    fontSize: 40,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionLabel: {
    ...TextStyles.caption,
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  colorRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...Shadow.md,
  },
  footer: {
    gap: Spacing.md,
    paddingTop: Spacing.sm,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 52,
    borderRadius: Radius.full,
    ...Shadow.md,
  },
});
