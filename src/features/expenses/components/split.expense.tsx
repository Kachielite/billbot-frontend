import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const SPLIT_OPTIONS = [
  {
    label: 'Evenly',
    value: 'evenly',
    emoji: '⚖️',
    description: 'Split the expense evenly among all participants.',
  },
  {
    label: 'Custom',
    value: 'custom',
    emoji: '🛠️',
    description: 'Manually assign amounts to each participant.',
  },
];

export default function SplitExpense() {
  const colors = useThemeColors();
  const [selectedOption, setSelectedOption] = React.useState<string>('evenly');
  return (
    <View style={styles.container}>
      <Text style={[TextStyles.label, { color: colors.text.primary }]}>SPLIT</Text>
      <View style={styles.splitOptionsContainer}>
        {SPLIT_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.splitOption,
              {
                borderColor:
                  selectedOption === option.value ? colors.primary : colors.border.default,
                backgroundColor: colors.surface,
                outlineColor: selectedOption === option.value ? colors.primary + 40 : 'transparent',
                outlineWidth: selectedOption === option.value ? 2 : 0,
              },
            ]}
            onPress={() => setSelectedOption(option.value)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <View style={[styles.emojiContainer, { backgroundColor: colors.primary + 20 }]}>
                <Text style={[TextStyles.body, { color: colors.text.primary }]}>
                  {option.emoji}
                </Text>
              </View>
              <View style={styles.optionLabel}>
                <Text style={[TextStyles.label, { color: colors.text.primary }]}>
                  {option.label}
                </Text>
                <Text style={[TextStyles.caption, { color: colors.text.secondary }]}>
                  {option.description}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.checkmarkContainer,
                {
                  outlineColor:
                    selectedOption === option.value ? colors.primary : colors.border.default,
                  outlineWidth: selectedOption === option.value ? 2 : 1,
                },
              ]}
            >
              {selectedOption === option.value && (
                <Ionicons name="checkmark-circle-sharp" size={24} color={colors.primary} />
              )}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  splitOptionsContainer: {
    flexDirection: 'column',
    gap: Spacing.md,
  },
  splitOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  emojiContainer: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  optionLabel: {
    flexDirection: 'column',
    gap: Spacing.xs,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
});
