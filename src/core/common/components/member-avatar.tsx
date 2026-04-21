import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import getInitials from '@/core/common/utils/get-initials';
import useThemeColors from '@/core/common/hooks/use-theme-colors';

type AvatarProps = {
  name: string;
  avatarSize?: number;
  avatarUrl?: string;
};

export default function MemberAvatar({ name, avatarSize = 45, avatarUrl }: AvatarProps) {
  const colors = useThemeColors();
  const randomSeed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = randomSeed % colors.groupColors.length;
  const swatch = colors.groupColors[index];
  return (
    <>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={[
            styles.avatar,
            {
              borderColor: colors.surface,
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: swatch.fill,
              borderColor: colors.surface,
            },
          ]}
        >
          <Text style={[styles.initials, { color: swatch.on }]}>{getInitials(name)}</Text>
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  avatar: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
