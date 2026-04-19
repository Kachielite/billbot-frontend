import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EmojiPicker from 'rn-emoji-keyboard';
import type { EmojiType } from 'rn-emoji-keyboard';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Radius, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';

// ── constants ────────────────────────────────────────────────────────────────
const COLS = 6;
const ROWS = 2;
const TOTAL_SLOTS = COLS * ROWS;
const MAX_ICONS = TOTAL_SLOTS - 1;
const ITEM_GAP = Spacing.sm;

// Pre-create a fixed array of refs for all icon slots (indices 0–10)
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
  // stable refs for all icon slots — never recreated
  const slotRefs = useRef(createSlotRefs());

  // 'add' | null
  const [showPicker, setShowPicker] = useState(false);

  const closePopover = () => setPopoverIndex(null);

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

  const renderSlots = () => {
    const rows: React.ReactNode[] = [];
    // plus button sits right after the last icon (unless all slots are full)
    const plusSlotIdx = icons.length < MAX_ICONS ? icons.length : -1;

    for (let row = 0; row < ROWS; row++) {
      const cells: React.ReactNode[] = [];
      for (let col = 0; col < COLS; col++) {
        const idx = row * COLS + col;
        const isPlusSlot = idx === plusSlotIdx;
        const icon = icons[idx];
        const isSelected = !!icon && selectedIcon === icon;

        if (isPlusSlot) {
          cells.push(
            <TouchableOpacity
              key="plus"
              onPress={() => setShowPicker(true)}
              style={[
                styles.slot,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border.subtle,
                  borderWidth: Border.thin,
                },
              ]}
            >
              <Ionicons name="add" size={22} color={colors.text.secondary} />
            </TouchableOpacity>,
          );
          continue;
        }

        if (icon) {
          cells.push(
            <View key={`icon-${icon}`} style={styles.slotWrapper}>
              <TouchableOpacity
                ref={slotRefs.current[idx]}
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

              <Popover
                isVisible={popoverIndex === idx}
                from={slotRefs.current[idx] as React.RefObject<React.Component>}
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
            </View>,
          );
          continue;
        }

        // invisible spacer
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
});
