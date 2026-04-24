import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import React, { ReactNode } from 'react';
import { Radius, Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { useNavigation } from '@react-navigation/native';

export default function CustomFormSheet({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const colors = useThemeColors();
  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.overlay,
        { backgroundColor: scheme === 'light' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.1)' },
      ]}
    >
      {/* Tap outside to dismiss */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => navigation.canGoBack() && navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <ScrollView
            contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? Spacing.lg : Spacing.xl,
  },
  content: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    gap: Spacing.lg,
  },
});
