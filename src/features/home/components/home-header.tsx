import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import { Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import useUserStore from '@/features/user/user.state';
import { getGreetingForName } from '@/core/common/utils/helper';
import Popover from 'react-native-popover-view';
import { GlassView } from 'expo-glass-effect';

const AddOptions = () => {
  const colors = useThemeColors();
  const [showPopover, setShowPopover] = useState(false);

  const options: {
    label: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    onPress: () => void;
  }[] = [
    {
      label: 'New expense',
      icon: 'receipt-outline',
      onPress: () => console.log('got hit'),
    },
    {
      label: 'New group',
      icon: 'people-outline',
      onPress: () => console.log('got hit'),
    },
  ];

  return (
    <Popover
      isVisible={showPopover}
      popoverStyle={{
        backgroundColor: colors.surface,
        borderWidth: 0,
        borderRadius: Radius.lg,
        ...Shadow.sm,
      }}
      onRequestClose={() => setShowPopover(false)}
      from={
        <Pressable
          style={[styles.notificationBtn, { backgroundColor: colors.surface }]}
          onPress={() => setShowPopover(true)}
        >
          <Ionicons name="add-sharp" size={24} color={colors.text.primary} />
        </Pressable>
      }
    >
      <GlassView style={[styles.optionsContainer, { backgroundColor: colors.surface }]}>
        {options.map((option, index) => (
          <Pressable
            key={index}
            onPress={() => {
              option.onPress();
              setShowPopover(false);
            }}
            style={[
              styles.option,
              {
                borderBottomColor:
                  index !== options.length - 1 ? colors.border.subtle : 'transparent',
                borderBottomWidth: index !== options.length - 1 ? 1 : 0,
              },
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: colors.background }]}>
              <Ionicons name={option.icon} size={18} color={colors.primary} />
            </View>
            <Text style={[TextStyles.label, { color: colors.text.primary }]}>{option.label}</Text>
          </Pressable>
        ))}
      </GlassView>
    </Popover>
  );
};

const HomeHeader = () => {
  const { user } = useUserStore();
  const colors = useThemeColors();
  return (
    <View style={[styles.container]}>
      <View>
        <Text style={[TextStyles.headingLarge, { color: colors.text.primary }]}>
          {getGreetingForName()}
        </Text>
        <Text style={[TextStyles.bodyMedium, { color: colors.text.secondary }]}>{user?.name}</Text>
      </View>
      <View style={styles.cta}>
        <AddOptions />
        <Pressable
          style={[styles.notificationBtn, { backgroundColor: colors.surface }]}
          onPress={() => {}}
        >
          <Ionicons name="notifications" size={24} color={colors.text.primary} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  cta: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
  },
  option: {
    padding: Spacing.xs,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconWrap: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
});

export default HomeHeader;
