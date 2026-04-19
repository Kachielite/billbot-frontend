import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import CustomTextInput from '@/core/common/components/form/custom-text-input';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import useCreateGroup from '../hooks/use-create-group';
import NewGroupHeader from '@/features/groups/components/new-group.header';
import AntDesign from '@expo/vector-icons/AntDesign';

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
      <NewGroupHeader />
      {/* ── Preview ────────────────────────────────────────────────── */}
      <View style={styles.previewContainer}>
        <View style={[styles.iconPreview, { backgroundColor: selectedColor + '30' }]}>
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
        <View style={styles.iconGrid}>
          {[0, 1].map((row) => (
            <View key={row} style={styles.iconRow}>
              {Array.from({ length: ICONS_PER_ROW }).map((_, col) => {
                const idx = row * ICONS_PER_ROW + col;
                const totalSlots = ICONS_PER_ROW * 2;
                const isPlusSlot = idx === totalSlots - 1;
                const icon = GROUP_ICONS[idx];

                const baseStyle = [
                  styles.iconItem,
                  { height: iconSize, backgroundColor: colors.surface },
                ];

                if (isPlusSlot) {
                  return (
                    <TouchableOpacity
                      key={`plus`}
                      onPress={() => {}}
                      style={[
                        ...baseStyle,
                        {
                          borderColor: colors.border.subtle,
                          borderWidth: Border.thin,
                        },
                      ]}
                    >
                      <Ionicons name="add" size={22} color={colors.text.secondary} />
                    </TouchableOpacity>
                  );
                }

                if (icon) {
                  const isSelected = selectedIcon === icon;
                  return (
                    <TouchableOpacity
                      key={`icon-${idx}`}
                      onPress={() => setSelectedIcon(icon)}
                      style={[
                        ...baseStyle,
                        {
                          borderColor: isSelected ? selectedColor : colors.border.subtle,
                          borderWidth: isSelected ? 2 : Border.thin,
                        },
                      ]}
                    >
                      <Text style={styles.iconEmoji}>{icon}</Text>
                    </TouchableOpacity>
                  );
                }

                return (
                  <View
                    key={`empty-${idx}`}
                    style={[
                      ...baseStyle,
                      {
                        borderColor: colors.border.subtle,
                        borderWidth: Border.thin,
                      },
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* ── Color selector ─────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, TextStyles.label, { color: colors.text.secondary }]}>
          COLOR
        </Text>
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
  iconGrid: {
    flexDirection: 'column',
    gap: ICON_GAP,
  },
  iconRow: {
    flexDirection: 'row',
    gap: ICON_GAP,
  },
  iconItem: {
    flex: 1,
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
