import {
  Pressable,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { TextStyles } from '@/core/common/constants/fonts';
import { Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import useUserStore from '@/features/user/user.state';
import { getGreetingForName } from '@/core/common/utils/helper';
import { useNavigation } from '@react-navigation/native';

const HomeHeader = () => {
  const navigation = useNavigation();
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
        <TouchableOpacity
          style={[styles.notificationBtn, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('NewExpense')}
        >
          <Ionicons name="add-sharp" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.notificationBtn, { backgroundColor: colors.surface }]}
          onPress={() => {}}
        >
          <Ionicons name="notifications" size={24} color={colors.text.primary} />
        </TouchableOpacity>
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
    gap: Spacing.md,
  },
  iconWrap: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
});

export default HomeHeader;
