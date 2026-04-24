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
  disabled?: boolean;
};

const CustomButton = ({ label, onPress, loading, icon, disabled }: CustomButtonProps) => {
  const colors = useThemeColors();
  const isDisabled = Boolean(disabled || loading);

  if (loading) {
    return <ActivityIndicator size="small" color={colors.text.primary} />;
  }

  return (
    <GlassView
      tintColor={isDisabled ? colors.primaryContainer : colors.primary}
      isInteractive={!isDisabled}
      style={[
        styles.btn,
        {
          backgroundColor: isDisabled ? colors.primaryContainer : colors.primary,
        },
      ]}
    >
      <TouchableOpacity onPress={onPress} disabled={isDisabled} style={styles.touchable}>
        {icon}
        <Text
          style={[
            styles.buttonLabel,
            { color: isDisabled ? colors.onPrimaryContainer : colors.onPrimary },
          ]}
        >
          {label}
        </Text>
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
  touchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});

export default CustomButton;
