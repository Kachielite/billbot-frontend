import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { TextStyles } from '@/core/common/constants/fonts';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Border, Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { Expense } from '@/features/expenses/expenses.interface';

interface Props {
  poolName: string;
  expense: Expense;
  onDeletePress: () => void;
  onCancelRecurrencePress: () => void;
}

export default function ExpenseDetailHeader({
  poolName,
  expense,
  onDeletePress,
  onCancelRecurrencePress,
}: Props) {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<'delete' | 'cancel' | null>(null);

  const menuItems = [
    ...(expense.isRecurring
      ? [{ label: 'Cancel Recurrence', icon: 'repeat-outline' as const }]
      : []),
    { label: 'Delete Expense', icon: 'trash-outline' as const },
  ];

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
              { color: colors.text.secondary, textTransform: 'uppercase' },
            ]}
          >
            {poolName}
          </Text>
          <Text style={[TextStyles.headingMedium, { color: colors.text.primary }]}>
            EXPENSE DETAIL
          </Text>
        </View>
      </View>

      <Popover
        isVisible={popoverOpen}
        onRequestClose={() => setPopoverOpen(false)}
        onCloseComplete={() => {
          if (pendingAction === 'delete') {
            setPendingAction(null);
            onDeletePress();
          } else if (pendingAction === 'cancel') {
            setPendingAction(null);
            onCancelRecurrencePress();
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
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && {
                  borderBottomWidth: Border.thin,
                  borderBottomColor: colors.border.subtle,
                },
              ]}
              onPress={() => {
                setPopoverOpen(false);
                if (item.label === 'Delete Expense') setPendingAction('delete');
                else if (item.label === 'Cancel Recurrence') setPendingAction('cancel');
              }}
            >
              <Ionicons name={item.icon} size={17} color={colors.error} />
              <Text style={[TextStyles.bodySmall, { color: colors.error }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Popover>
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
});
