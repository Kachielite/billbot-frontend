import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { TextStyles } from '@/core/common/constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { useNavigation } from '@react-navigation/native';

export default function ManageMembersHeader() {
  const navigation = useNavigation();
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[TextStyles.headingLarge, { color: colors.text.secondary }]}>
          Manage members
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
});
