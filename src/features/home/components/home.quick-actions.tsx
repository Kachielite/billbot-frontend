import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
// ...existing code...
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import BottomModal from '@/core/common/components/layout/bottom-modal';
import HomeTab from '@/features/home/components/home.tab';

export default function HomeQuickActions() {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const [showNewTabModal, setShowNewTabModal] = React.useState(false);

  const QUICK_ACTIONS = [
    {
      name: 'Add expense',
      icon: <FontAwesome6 name="add" size={24} color={colors.primary} />,
      action: () => navigation.navigate('NewExpenseHome'),
      backgroundColor: colors.primaryContainer,
    },
    {
      name: 'Settle up',
      icon: <FontAwesome6 name="arrow-right-arrow-left" size={24} color={colors.primary} />,
      action: () => console.log('Settle up action'),
      backgroundColor: colors.primaryContainer,
    },
    {
      name: 'New group',
      icon: <FontAwesome6 name="user-group" size={24} color={colors.primary} />,
      action: () => navigation.navigate('NewGroup'),
      backgroundColor: colors.primaryContainer,
    },
    {
      name: 'New tab',
      icon: <MaterialCommunityIcons name="folder-table" size={24} color={colors.primary} />,
      action: () => setShowNewTabModal(true),
      backgroundColor: colors.primaryContainer,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {QUICK_ACTIONS.map((action, index) => (
        <View key={index} onTouchStart={action.action} style={styles.actionButton}>
          <View style={[styles.actionIcon, { backgroundColor: action.backgroundColor }]}>
            {action.icon}
          </View>
          <Text
            style={[styles.actionLabel, { color: colors.text.primary }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            {action.name}
          </Text>
        </View>
      ))}
      <BottomModal visible={showNewTabModal} onCancel={() => setShowNewTabModal(false)}>
        <HomeTab onCancel={() => setShowNewTabModal(false)} />
      </BottomModal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xxl,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    width: '100%',
    ...Shadow.sm,
  },
  actionButton: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: Spacing.md,
  },
  actionIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    height: 60,
    width: 60,
  },
  actionLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
