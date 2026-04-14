import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type AuthButtonProps = {
  label: string;
  onPress?: () => void;
  logo?: 'logo-google' | 'logo-apple' | 'logo-facebook';
  color?: string;
  borderColor?: string;
  labelColor?: string;
  loading?: boolean;
};

const AuthButton = ({
  logo,
  label,
  onPress,
  color,
  borderColor,
  labelColor,
  loading,
}: AuthButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          backgroundColor: color,
          borderColor: borderColor,
          borderWidth: borderColor ? 1 : 0,
          boxShadow: loading ? '0px 4px 6px rgba(0, 0, 0, 0.4)' : 'none',
        },
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {!loading && logo && <Ionicons name={logo} size={18} color={labelColor} />}
      <Text style={[styles.buttonLabel, { color: labelColor }]}>
        {loading ? '...Loading' : label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    borderRadius: 12,
    gap: 12,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AuthButton;
