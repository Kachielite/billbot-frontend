import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { TextStyles } from '@/core/common/constants/fonts';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import usePoolsStore from '@/features/pools/pools.state';

export default function ExpenseHeader() {
  const { selectedPool } = usePoolsStore();
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
            {selectedPool?.name}
          </Text>
          <Text style={[TextStyles.headingLarge, { color: colors.text.primary }]}>Expenses</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('NewExpense')}
        style={[styles.newBtn, { backgroundColor: colors.primary }]}
        accessibilityLabel="Create new expense"
      >
        <Ionicons name="add" size={20} color={colors.onPrimary} />
        <Text style={[TextStyles.label, { color: colors.onPrimary }]}>New</Text>
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
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    ...Shadow.sm,
  },
});
