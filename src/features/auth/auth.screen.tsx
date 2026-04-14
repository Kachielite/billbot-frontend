import { StyleSheet, View } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import LottieView from 'lottie-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Fonts } from '@/core/common/constants/theme';

const AuthScreen = () => {
  const colors = useThemeColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.primaryContainer }]}>
      <View style={styles.contentContainer}>
        <Animated.Text
          entering={FadeInDown}
          style={[styles.headline, { color: colors.text.primary }]}
        >
          Split bills, not friendships
        </Animated.Text>
        <LottieView
          source={require('../../core/assets/animations/wallet-animation.json')}
          autoPlay
          loop
          style={styles.imageContainer}
        />
        <Animated.Text
          entering={FadeInDown}
          style={[styles.tagline, { color: colors.text.primary }]}
        >
          Track shared expenses, settle up fairly, and keep the peace with everyone who matters.
        </Animated.Text>
      </View>
    </View>
  );
};
export default AuthScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 450,
    height: 600,
  },
  headline: {
    position: 'absolute',
    top: 10,
    fontSize: 32,
    fontFamily: Fonts.brandBlack,
    textAlign: 'center',
    width: '100%',
  },
  tagline: {
    position: 'absolute',
    bottom: 10,
    fontSize: 18,
    fontFamily: Fonts.brand,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 30,
  },
});
