import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Radius, Spacing } from '@/core/common/constants/theme';

type Props = {
  width?: number | string;
  height?: number | string;
  style?: StyleProp<ViewStyle>;
  bg?: string;
};

export default function SkeletonBox({ width = 170, height = 110, style, bg }: Props) {
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

  const backgroundColor = bg ?? 'rgba(255,255,255,0.06)';

  return (
    <Animated.View
      style={[
        styles.box,
        // width/height may be number or percent string; cast to any to satisfy Animated style typing
        { width: width as any, height: height as any, backgroundColor, opacity } as any,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: Radius.lg,
    marginRight: Spacing.md,
  },
});
