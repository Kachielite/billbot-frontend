import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { TextStyles } from '@/core/common/constants/fonts';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Popover, { PopoverPlacement } from 'react-native-popover-view';

const MENU_ITEMS = [
  { label: 'Add Expense', icon: 'add-sharp' as const, destructive: false },
  { label: 'Edit Pool', icon: 'create-outline' as const, destructive: false },
  { label: 'Delete Pool', icon: 'trash-outline' as const, destructive: true },
];

interface PoolHeaderProps {
  isAdmin: boolean;
  onDeletePress: () => void;
  poolName: string;
  groupName: string;
}

export default function PoolHeader({
  isAdmin,
  onDeletePress,
  poolName,
  groupName,
}: PoolHeaderProps) {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState(false);
  const visibleMenuItems = MENU_ITEMS.filter((item) => {
    if (poolName === 'General') {
      return item.label === 'Add Expense';
    }

    return true;
  });

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
            {groupName} GROUP
          </Text>
          <Text style={[TextStyles.headingMedium, { color: colors.text.secondary }]}>
            {poolName}
          </Text>
        </View>
      </View>
      {isAdmin ? (
        <Popover
          isVisible={popoverOpen}
          onRequestClose={() => setPopoverOpen(false)}
          onCloseComplete={() => {
            if (pendingDelete) {
              setPendingDelete(false);
              onDeletePress();
            }
          }}
          placement={PopoverPlacement.BOTTOM}
          from={(sourceRef, _openPopover) => (
            <TouchableOpacity
              ref={sourceRef as unknown as React.RefObject<View>}
              style={[styles.optionBtn, { backgroundColor: colors.surface }]}
              onPress={() => setPopoverOpen(true)}
            >
              <Ionicons name="ellipsis-horizontal-sharp" size={18} color={colors.text.primary} />
            </TouchableOpacity>
          )}
          popoverStyle={[styles.popover, { backgroundColor: colors.surface }]}
          backgroundStyle={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
        >
          <View>
            {visibleMenuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  index < visibleMenuItems.length - 1 && {
                    borderBottomWidth: Border.thin,
                    borderBottomColor: colors.border.subtle,
                  },
                ]}
                onPress={() => {
                  setPopoverOpen(false);
                  if (item.label === 'Delete Pool') {
                    setPendingDelete(true);
                  }
                }}
              >
                <Ionicons
                  name={item.icon}
                  size={17}
                  color={item.destructive ? colors.error : colors.text.secondary}
                />
                <Text
                  style={[
                    TextStyles.bodySmall,
                    { color: item.destructive ? colors.error : colors.text.primary },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Popover>
      ) : (
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
          }}
        >
          <FontAwesome6 name="add-sharp" size={16} color={colors.text.primary} />
        </TouchableOpacity>
      )}
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
});
