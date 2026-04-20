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
  { label: 'Edit Group', icon: 'create-outline' as const },
  { label: 'Manage Members', icon: 'people-outline' as const },
  { label: 'Delete Group', icon: 'trash-outline' as const, destructive: true },
];

interface GroupHeaderProps {
  groupId: string;
}

export default function GroupHeader({ groupId }: GroupHeaderProps) {
  const navigation = useNavigation() as any;
  const colors = useThemeColors();
  const popoverRef = React.useRef<Popover>(null);

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
            <FontAwesome6 name="chevron-left" size={16} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={[TextStyles.headingMedium, { color: colors.text.secondary }]}>
            GROUP DETAILS
          </Text>
        </View>
      </View>

      <Popover
        ref={popoverRef}
        placement={PopoverPlacement.BOTTOM}
        from={(sourceRef, openPopover) => (
          <TouchableOpacity
            ref={sourceRef as unknown as React.RefObject<View>}
            style={[styles.optionBtn, { backgroundColor: colors.surface }]}
            onPress={openPopover}
          >
            <Ionicons name="ellipsis-horizontal-sharp" size={18} color={colors.text.primary} />
          </TouchableOpacity>
        )}
        popoverStyle={[styles.popover, { backgroundColor: colors.surface }]}
        backgroundStyle={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
      >
        <View>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < MENU_ITEMS.length - 1 && {
                  borderBottomWidth: Border.thin,
                  borderBottomColor: colors.border.subtle,
                },
              ]}
              onPress={() => {
                popoverRef.current?.setState({ isVisible: false });
                if (item.label === 'Edit Group') {
                  navigation.navigate('EditGroup', { groupId });
                } else if (item.label === 'Manage Members') {
                  navigation.navigate('ManageMembers', { groupId });
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
    </View>
  );
}
const styles = StyleSheet.create({
  popover: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.xs,
    minWidth: 190,
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
  menuEmoji: {
    // kept for layout spacing; icon replaces emoji
    width: 20,
    alignItems: 'center',
  },
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
    alignItems: 'center',
    gap: Spacing.md,
  },
  backBtn: {
    width: 45,
    height: 45,
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
  optionBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
});
