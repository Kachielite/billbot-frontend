import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { TextStyles } from '@/core/common/constants/fonts';
import { Radius, Spacing } from '@/core/common/constants/theme';

type InfoBoxProps = {
  title: string;
  description: string;
};

export default function InfoBox({ title, description }: InfoBoxProps) {
  const colors = useThemeColors();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.primaryContainer, borderColor: colors.primary },
      ]}
    >
      <View style={[styles.infoIcon, { backgroundColor: colors.primary }]}>
        <Ionicons name="information-circle-outline" size={24} color={colors.text.inverse} />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={[TextStyles.label, styles.wrapText, { color: colors.text.primary }]}>
          {title}
        </Text>
        <Text style={[TextStyles.caption, styles.wrapText, { color: colors.text.primary }]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.xs,
    flex: 1,
    alignItems: 'flex-start',
  },
  wrapText: {
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});
