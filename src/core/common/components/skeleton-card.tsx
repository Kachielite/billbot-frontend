import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { GlassView } from 'expo-glass-effect';
import { Radius, Spacing } from '@/core/common/constants/theme';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  tintColor?: string;
  cardBg?: string;
};

export default function SkeletonCard({ containerStyle, tintColor, cardBg }: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.85] });

  const bg = cardBg ?? 'rgba(255,255,255,0.08)';

  return (
    <GlassView
      tintColor={tintColor}
      style={[styles.container, containerStyle, { backgroundColor: tintColor ?? '#000' }]}
    >
      <View style={styles.totalBalance}>
        <Animated.View style={[styles.skelLabel, { backgroundColor: bg, opacity }]} />
        <Animated.View style={[styles.skelAmount, { backgroundColor: bg, opacity }]} />
        <Animated.View style={[styles.skelSubtitle, { backgroundColor: bg, opacity }]} />
      </View>
      <View style={styles.balanceCardContainer}>
        <Animated.View style={[styles.balanceCard, { backgroundColor: bg, opacity }]} />
        <Animated.View style={[styles.balanceCard, { backgroundColor: bg, opacity }]} />
      </View>
    </GlassView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  totalBalance: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  balanceCardContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  balanceCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.sm,
    height: 64,
  },
  skelLabel: {
    width: '48%',
    height: 12,
    borderRadius: Radius.sm,
    marginBottom: Spacing.xs,
  },
  skelAmount: {
    width: '78%',
    height: 36,
    borderRadius: Radius.md,
    marginVertical: Spacing.sm,
  },
  skelSubtitle: {
    width: '36%',
    height: 12,
    borderRadius: Radius.sm,
  },
});
