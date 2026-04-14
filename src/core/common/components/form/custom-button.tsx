import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { ReactElement } from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { GlassView } from 'expo-glass-effect';

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
    <GlassView tintColor={colors.primary} isInteractive style={[styles.btn]}>
      <TouchableOpacity onPress={onPress} disabled={loading}>
        {icon}
        <Text style={[styles.buttonLabel, { color: colors.text.primary }]}>{label}</Text>
      </TouchableOpacity>
    </GlassView>
  );
};

const styles = StyleSheet.create({
  buttonLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  btn: {
    width: '97%',
    height: 50,
    borderRadius: 45,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default CustomButton;
