import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import { Radius, Shadow } from '@/core/common/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import useUserStore from '@/features/user/user.state';
import { getGreetingForName } from '@/core/common/utils/helper';

const HomeHeader = () => {
  const { user } = useUserStore();
  const colors = useThemeColors();
  return (
    <View style={[styles.container]}>
      <View>
        <Text style={[styles.greetings, { color: colors.text.primary }]}>
          {getGreetingForName()}
        </Text>
        <Text style={[styles.name, { color: colors.text.secondary }]}>{user?.name}</Text>
      </View>
      <Pressable
        style={[styles.notificationBtn, { backgroundColor: colors.surface }]}
        onPress={() => {}}
      >
        <Ionicons name="notifications" size={24} color={colors.text.primary} />
      </Pressable>
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
  greetings: {
    ...TextStyles.headingLarge,
  },
  name: {
    ...TextStyles.label,
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
});

export default HomeHeader;
