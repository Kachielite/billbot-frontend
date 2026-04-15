import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { GlassView } from 'expo-glass-effect';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Shadow } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';

interface Props {
  title?: string;
  children?: React.ReactNode;
  isBack?: boolean;
}

const BackIcon = () => {
  const colors = useThemeColors();
  const navigation = useNavigation();
  return (
    <GlassView tintColor={colors.surface} isInteractive style={[styles.backBtn]}>
      <Pressable
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      >
        <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
      </Pressable>
    </GlassView>
  );
};

export default function ScreenHeader({ title = 'Good morning', children, isBack }: Props) {
  const colors = useThemeColors();
  return (
    <View style={[styles.container]}>
      {isBack && <BackIcon />}
      <Text style={[styles.greetings, { color: colors.text.primary }]}>{title}</Text>
      {children ? children : <View />}
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
  greetings: {
    ...TextStyles.headingLarge,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 45,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
});
