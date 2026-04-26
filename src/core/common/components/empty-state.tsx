import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Spacing } from '@/core/common/constants/theme';
import { GlassView } from 'expo-glass-effect';

type Props = {
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  cta?: React.ReactNode;
};

export default function EmptyState({
  title = 'Nothing here',
  subtitle,
  actionLabel,
  onAction,
  cta,
}: Props) {
  const colors = useThemeColors();

  return (
    <GlassView
      tintColor={colors.surface}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.background }]}>
        <Ionicons name="folder-open-outline" size={28} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>{subtitle}</Text>
      ) : null}
      {cta ? (
        <>{cta}</>
      ) : actionLabel && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={{ color: colors.text.onPrimary }}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </GlassView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  button: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
});
