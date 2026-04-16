import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import useThemeColors from '@/core/common/hooks/use-theme-colors';

export default function NewGroupScreen() {
  const navigation = useNavigation();
  const colors = useThemeColors();

  return (
    <ScreenContainer useScrollView={false} contentContainerStyle={styles.container}>
      <View>
        <Text style={[styles.title, { color: colors.text.primary }]}>New Group</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Form sheet is loaded. Build your create-group form here.
        </Text>

        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.closeButton, { backgroundColor: colors.primaryContainer }]}
        >
          <Text style={[styles.closeText, { color: colors.text.primary }]}>Close</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
  },
  closeButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  closeText: {
    fontWeight: '600',
  },
});
