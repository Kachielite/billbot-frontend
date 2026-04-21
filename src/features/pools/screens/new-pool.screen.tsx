import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import React from 'react';
import NewPoolHeader from '@/features/pools/components/new-pool.header';
import PoolInfo from '@/features/pools/components/pool-info';
import useCreatePool from '@/features/pools/hooks/use-create-pool';
import NewPoolForm from '@/features/pools/components/new-pool.form';
import type { StaticScreenProps } from '@react-navigation/native';
import { Radius, Spacing } from '@/core/common/constants/theme';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { useNavigation } from '@react-navigation/native';

type Props = StaticScreenProps<{ groupId: string }>;

export default function NewPoolScreen({ route }: Props) {
  const { groupId } = route.params;
  const scheme = useColorScheme();
  const { form, createPoolHandler, isCreating } = useCreatePool(groupId);
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
            <NewPoolHeader />
            <PoolInfo />
            <NewPoolForm
              formController={form}
              onCreatePool={createPoolHandler}
              isCreating={isCreating}
            />
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
