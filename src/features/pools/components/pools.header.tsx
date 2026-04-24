import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { TextStyles } from '@/core/common/constants/fonts';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface PoolsHeaderProps {
  totalPools: number;
  groupName: string;
  groupId: string;
}

export default function PoolsHeader({ totalPools, groupName, groupId }: PoolsHeaderProps) {
  const navigation = useNavigation();
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
          }}
        >
          <FontAwesome6 name="chevron-left" size={16} color={colors.text.primary} />
        </TouchableOpacity>
        <View>
          <Text
            style={[
              TextStyles.bodySmall,
              { color: colors.text.primary, textTransform: 'uppercase' },
            ]}
          >
            Total of {totalPools} {totalPools === 1 ? 'Tab' : 'Tabs'} in
          </Text>
          <Text style={[TextStyles.headingMedium, { color: colors.text.secondary }]}>
            {groupName} GROUP
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('NewPool', { groupId: groupId })}
        style={[styles.newBtn, { backgroundColor: colors.primary }]}
        accessibilityLabel="Create new group"
      >
        <Ionicons name="add" size={20} color={colors.onPrimary} />
        <Text style={[TextStyles.label, { color: colors.onPrimary }]}>New</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  optionBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  popover: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.xs,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
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
