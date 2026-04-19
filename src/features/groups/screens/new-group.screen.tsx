import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GlassView } from 'expo-glass-effect';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import CustomTextAreaInput from '@/core/common/components/form/custom-text-area-input';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useCreateGroup from '../hooks/use-create-group';

const GROUP_ICONS = ['🏠', '👥', '✈️', '🍽️', '🏢', '🎮', '💪', '🎓', '⚽', '🎉', '☕'];
const GROUP_COLORS = ['#1B7A48', '#E8920A', '#5C3E8A', '#185FA5', '#BA1A1A', '#71796F'];
const ICON_GAP = Spacing.sm;
const ICONS_PER_ROW = 6;
const SCREEN_H_PADDING = 12;

export default function NewGroupScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const { form, isCreating, createGroup } = useCreateGroup();
  const { width } = useWindowDimensions();

  const [selectedIcon, setSelectedIcon] = useState(GROUP_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(GROUP_COLORS[0]);

  const groupName = form.watch('name');

  const iconSize = (width - 2 * SCREEN_H_PADDING - (ICONS_PER_ROW - 1) * ICON_GAP) / ICONS_PER_ROW;

  const handleContinue = form.handleSubmit(async (data) => {
    await createGroup(data);
  });

  return (
    <ScreenContainer>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <GlassView tintColor={colors.surface} isInteractive style={styles.closeBtn}>
          <Pressable onPress={() => navigation.canGoBack() && navigation.goBack()}>
            <Ionicons name="close" size={20} color={colors.text.primary} />
          </Pressable>
        </GlassView>

        <View style={styles.headerCenter}>
          <Text style={[TextStyles.caption, { color: colors.text.secondary, letterSpacing: 0.6 }]}>
            STEP 1 OF 2
          </Text>
          <Text style={[TextStyles.headingMedium, { color: colors.text.primary }]}>New group</Text>
        </View>

        <TouchableOpacity onPress={handleContinue} hitSlop={8}>
          <Text style={[TextStyles.bodyMedium, { color: colors.text.secondary }]}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* ── Preview ────────────────────────────────────────────────── */}
      <View style={styles.previewContainer}>
        <View style={[styles.iconPreview, { backgroundColor: selectedColor + '33' }]}>
          <Text style={styles.iconPreviewEmoji}>{selectedIcon}</Text>
        </View>
        <Text style={[TextStyles.headingSmall, { color: colors.text.primary }]}>
          {groupName || 'Group name'}
        </Text>
        <Text style={[TextStyles.caption, { color: colors.text.secondary }]}>Preview</Text>
      </View>

      {/* ── Group Name ─────────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>GROUP NAME</Text>
        <CustomTextInput
          id="name"
          formController={form}
          placeholder="e.g. Family, Lagos Trip, Office lunch"
          required
        />
      </View>

      {/* ── Description ────────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>DESCRIPTION</Text>
        <CustomTextAreaInput
          id="description"
          formController={form}
          placeholder="What's this group for?"
          numberOfLines={3}
          maxLength={500}
        />
      </View>

      {/* ── Icon selector ──────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>ICON</Text>
        <View style={styles.iconGrid}>
          {GROUP_ICONS.map((icon) => {
            const isSelected = selectedIcon === icon;
            return (
              <TouchableOpacity
                key={icon}
                onPress={() => setSelectedIcon(icon)}
                style={[
                  styles.iconItem,
                  {
                    width: iconSize,
                    height: iconSize,
                    backgroundColor: colors.surface,
                    borderColor: isSelected ? selectedColor : colors.border.subtle,
                    borderWidth: isSelected ? 2 : Border.thin,
                  },
                ]}
              >
                <Text style={styles.iconEmoji}>{icon}</Text>
              </TouchableOpacity>
            );
          })}
          {/* Plus button — takes the last slot */}
          <TouchableOpacity
            onPress={() => {}}
            style={[
              styles.iconItem,
              {
                width: iconSize,
                height: iconSize,
                backgroundColor: colors.surface,
                borderColor: colors.border.subtle,
                borderWidth: Border.thin,
              },
            ]}
          >
            <Ionicons name="add" size={22} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Color selector ─────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>COLOR</Text>
        <View style={styles.colorRow}>
          {GROUP_COLORS.map((color) => {
            const isSelected = selectedColor === color;
            return (
              <TouchableOpacity
                key={color}
                onPress={() => setSelectedColor(color)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  isSelected && styles.colorCircleSelected,
                ]}
              >
                {isSelected && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
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
          <Ionicons name="person-add-outline" size={18} color={colors.onPrimary} />
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
    paddingVertical: Spacing.sm,
  },
  iconPreview: {
    width: 80,
    height: 80,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
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
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ICON_GAP,
  },
  iconItem: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 26,
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
