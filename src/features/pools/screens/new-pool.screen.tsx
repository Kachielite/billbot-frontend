import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
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
  const { form, createPoolHandler } = useCreatePool(groupId);
  const colors = useThemeColors();
  const navigation = useNavigation();

  return (
    <View style={styles.overlay}>
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
            <NewPoolForm formController={form} onCreatePool={createPoolHandler} />
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? Spacing.lg : Spacing.xl,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  content: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.lg,
  },
});
