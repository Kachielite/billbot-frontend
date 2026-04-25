import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  onSave: () => void;
  isSaving: boolean;
};

export default function NewExpenseHeader({ onSave, isSaving }: Props) {
  const navigation = useNavigation();
  const colors = useThemeColors();
  return (
    <View style={[styles.container]}>
      <View style={styles.headerRight}>
        <View style={styles.backBtnContainer}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.surface }]}
            onPress={() => {
              if (navigation.canGoBack()) navigation.goBack();
            }}
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={[
              TextStyles.bodySmall,
              { color: colors.text.primary, textTransform: 'uppercase' },
            ]}
          >
            NEW
          </Text>
          <Text style={[TextStyles.headingLarge, { color: colors.text.primary }]}>Add Expense</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onSave} disabled={isSaving}>
        <Text style={[TextStyles.headingSmall, { color: colors.primary }]}>
          {isSaving ? 'Saving...' : 'Save'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  backBtnContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
});
