import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import LottieView from 'lottie-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AuthButton from '@/features/auth/components/auth-button';
import useAppleAuth from '@/features/auth/hooks/use-apple-auth';
import useGoogleAuth from '@/features/auth/hooks/use-google-auth';
import { TextStyles } from '@/core/common/constants/fonts';
import ScreenContainer from '@/core/common/components/layout/screen-container';

const AuthScreen = () => {
  const colors = useThemeColors();
  const isAndroid = Platform.OS === 'android';
  const { height: screenHeight } = useWindowDimensions();
  const animationSize = Math.min(screenHeight * 0.6, 380);

  const { isLoggingInWithApple, appleLoginHandler } = useAppleAuth();
  const { isLoggingInWithGoogle, googleLoginHandler } = useGoogleAuth();

  return (
    <ScreenContainer useScrollView={false}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.contentContainer}>
          <Animated.Text
            entering={FadeInDown}
            style={[styles.headline, { color: colors.text.primary }]}
          >
            Split bills, not{'\n'}friendships
          </Animated.Text>
          <LottieView
            source={require('../../core/assets/animations/wallet-animation.json')}
            autoPlay
            loop
            style={{ width: animationSize, height: animationSize }}
          />
          <Animated.Text
            entering={FadeInDown}
            style={[styles.tagline, { color: colors.text.primary }]}
          >
            Track shared expenses, settle up fairly, and keep the peace with everyone who matters.
          </Animated.Text>
        </View>
        <View style={styles.buttonContainer}>
          <Animated.View
            entering={FadeInDown.delay(100)}
            style={{ display: isAndroid ? 'none' : 'flex' }}
          >
            <AuthButton
              label="Sign in with Apple"
              onPress={appleLoginHandler}
              logo="logo-apple"
              color="#000000"
              labelColor="#FFFFFF"
              borderColor="#000000"
              loading={isLoggingInWithApple}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200)}>
            <AuthButton
              label="Sign in with Google"
              onPress={googleLoginHandler}
              logo="logo-google"
              color="#FFFFFF"
              borderColor="rgba(0, 0, 0, 0.25)"
              labelColor="#0F1115"
              loading={isLoggingInWithGoogle}
            />
          </Animated.View>
        </View>
      </View>
    </ScreenContainer>
  );
};
export default AuthScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  headline: {
    textAlign: 'center',
    width: '100%',
    ...TextStyles.displayLarge,
  },
  tagline: {
    textAlign: 'center',
    ...TextStyles.headingSmall,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 12,
    gap: 12,
  },
});
