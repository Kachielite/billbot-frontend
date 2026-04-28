import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { EmojiType } from 'rn-emoji-keyboard';
import EmojiPicker from 'rn-emoji-keyboard';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';

// ── constants ────────────────────────────────────────────────────────────────
const COLS = 6;
const ROWS = 2;
const TOTAL_SLOTS = COLS * ROWS;
const MAX_ICONS = TOTAL_SLOTS - 1; // 11
const PLUS_SLOT_IDX = TOTAL_SLOTS - 1; // always the last slot
const ITEM_GAP = Spacing.sm;

const createSlotRefs = () => Array.from({ length: MAX_ICONS }, () => React.createRef<View>());

interface Props {
  icons: string[];
  selectedIcon: string;
  selectedColor: string;
  onIconsChange: (icons: string[]) => void;
  onSelectIcon: (icon: string) => void;
}

export default function GroupIconSelector({
  icons,
  selectedIcon,
  selectedColor,
  onIconsChange,
  onSelectIcon,
}: Props) {
  const colors = useThemeColors();

  const [popoverIndex, setPopoverIndex] = useState<number | null>(null);
  const slotRefs = useRef(createSlotRefs());
  const plusRef = useRef<View>(null);

  const [showPicker, setShowPicker] = useState(false);
  const [showMaxTooltip, setShowMaxTooltip] = useState(false);

  const isFull = icons.length >= MAX_ICONS;

  const closePopover = () => setPopoverIndex(null);

  useEffect(() => {
    if (popoverIndex === null) return;
    const activeRef = slotRefs.current[popoverIndex]?.current;
    if (!activeRef || !icons[popoverIndex]) {
      setPopoverIndex(null);
    }
  }, [icons, popoverIndex]);

  const deleteIcon = (index: number) => {
    setPopoverIndex(null);
    setTimeout(() => {
      const next = [...icons];
      next.splice(index, 1);
      if (selectedIcon === icons[index] && next.length > 0) onSelectIcon(next[0]);
      onIconsChange(next);
    }, 300);
  };

  const handleEmojiSelected = (emoji: EmojiType) => {
    const picked = emoji.emoji;
    if (icons.length < MAX_ICONS && !icons.includes(picked)) {
      const next = [...icons, picked];
      onIconsChange(next);
      onSelectIcon(picked);
    }
    setShowPicker(false);
  };

  const handlePlusPress = () => {
    if (isFull) {
      setShowMaxTooltip(true);
    } else {
      setShowPicker(true);
    }
  };

  const renderSlots = () => {
    const rows: React.ReactNode[] = [];

    for (let row = 0; row < ROWS; row++) {
      const cells: React.ReactNode[] = [];
      for (let col = 0; col < COLS; col++) {
        const idx = row * COLS + col;

        // ── Plus button — always at the last slot ──────────────────────────
        if (idx === PLUS_SLOT_IDX) {
          cells.push(
            <View key="plus-wrapper" ref={plusRef} collapsable={false} style={styles.slotWrapper}>
              <TouchableOpacity
                onPress={handlePlusPress}
                style={[
                  styles.slot,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border.subtle,
                    borderWidth: Border.thin,
                    opacity: isFull ? 0.35 : 1,
                  },
                ]}
              >
                <Ionicons name="add" size={22} color={colors.text.secondary} />
              </TouchableOpacity>

              {showMaxTooltip && plusRef.current && (
                <Popover
                  isVisible
                  from={plusRef as React.RefObject<View>}
                  onRequestClose={() => setShowMaxTooltip(false)}
                  placement={PopoverPlacement.TOP}
                  backgroundStyle={{ backgroundColor: 'transparent' }}
                  popoverStyle={[styles.tooltip, { backgroundColor: colors.surface }]}
                >
                  <Text
                    style={[TextStyles.caption, styles.tooltipText, { color: colors.text.primary }]}
                  >
                    Press {'&'} hold any emoji to delete it, then add a new one.{'\n'}Max{' '}
                    {MAX_ICONS} emojis allowed.
                  </Text>
                </Popover>
              )}
            </View>,
          );
          continue;
        }

        // ── Icon slot ──────────────────────────────────────────────────────
        const icon = icons[idx];
        const isSelected = !!icon && selectedIcon === icon;

        if (icon) {
          cells.push(
            <View
              key={`icon-${icon}`}
              ref={slotRefs.current[idx]}
              collapsable={false}
              style={styles.slotWrapper}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowPicker(false);
                  onSelectIcon(icon);
                }}
                onLongPress={() => {
                  setShowPicker(false);
                  setPopoverIndex(idx);
                }}
                delayLongPress={400}
                style={[
                  styles.slot,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isSelected ? selectedColor : colors.border.subtle,
                    borderWidth: isSelected ? 2 : Border.thin,
                  },
                ]}
              >
                <Text style={styles.iconEmoji}>{icon}</Text>
              </TouchableOpacity>

              {popoverIndex === idx && slotRefs.current[idx]?.current && (
                <Popover
                  isVisible
                  from={slotRefs.current[idx] as React.RefObject<View>}
                  onRequestClose={closePopover}
                  placement={PopoverPlacement.TOP}
                  backgroundStyle={{ backgroundColor: 'transparent' }}
                  popoverStyle={{ backgroundColor: colors.surface }}
                >
                  <View style={[styles.popoverContent, { backgroundColor: colors.surface }]}>
                    <TouchableOpacity style={styles.popoverOption} onPress={() => deleteIcon(idx)}>
                      <Ionicons name="trash-outline" size={16} color={colors.error} />
                      <Text style={[TextStyles.label, { color: colors.error }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </Popover>
              )}
            </View>,
          );
          continue;
        }

        // ── Empty spacer ──────────────────────────────────────────────────
        cells.push(<View key={`empty-${idx}`} style={styles.slotWrapper} />);
      }
      rows.push(
        <View key={`row-${row}`} style={styles.row}>
          {cells}
        </View>,
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>{renderSlots()}</View>
      <EmojiPicker
        onEmojiSelected={handleEmojiSelected}
        open={showPicker}
        onClose={() => setShowPicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: ITEM_GAP },
  grid: { flexDirection: 'column', gap: ITEM_GAP },
  row: { flexDirection: 'row', gap: ITEM_GAP },
  slotWrapper: { flex: 1, aspectRatio: 1 },
  slot: {
    flex: 1,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: { fontSize: 24 },
  popoverContent: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.xs,
    minWidth: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  popoverOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  popoverDivider: { height: 1, marginHorizontal: Spacing.sm },
  tooltip: {
    borderRadius: Radius.md,
    maxWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  tooltipText: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    textAlign: 'center',
    lineHeight: 18,
  },
});
