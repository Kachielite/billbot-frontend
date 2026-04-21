import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { ReactElement } from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { GlassView } from 'expo-glass-effect';
import { TextStyles } from '@/core/common/constants/fonts';
import { Radius } from '@/core/common/constants/theme';

type CustomButtonProps = {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  icon?: ReactElement;
};

const CustomButton = ({ label, onPress, loading, icon }: CustomButtonProps) => {
  const colors = useThemeColors();

  if (loading) {
    return <ActivityIndicator size="small" color={colors.text.primary} />;
  }

  return (
    <GlassView
      tintColor={colors.primary}
      isInteractive
      style={[styles.btn, { backgroundColor: colors.primary }]}
    >
      <TouchableOpacity onPress={onPress} disabled={loading}>
        {icon}
        <Text style={[styles.buttonLabel, { color: colors.onPrimary }]}>{label}</Text>
      </TouchableOpacity>
    </GlassView>
  );
};

const styles = StyleSheet.create({
  buttonLabel: {
    ...TextStyles.button,
  },
  btn: {
    width: '100%',
    height: 50,
    borderRadius: Radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default CustomButton;
