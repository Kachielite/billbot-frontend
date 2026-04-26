import { Platform, StyleSheet, View } from 'react-native';
import React from 'react';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import LottieView from 'lottie-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AuthButton from '@/features/auth/components/auth-button';
import useAppleAuth from '@/features/auth/hooks/use-apple-auth';
import useGoogleAuth from '@/features/auth/hooks/use-google-auth';
import { TextStyles } from '@/core/common/constants/fonts';

const AuthScreen = () => {
  const colors = useThemeColors();
  const isAndroid = Platform.OS === 'android';

  const { isLoggingInWithApple, appleLoginHandler } = useAppleAuth();
  const { isLoggingInWithGoogle, googleLoginHandler } = useGoogleAuth();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
    top: 0,
    textAlign: 'center',
    width: '100%',
    ...TextStyles.displayLarge,
  },
  tagline: {
    position: 'absolute',
    bottom: 10,
    textAlign: 'center',
    marginBottom: 50,
    ...TextStyles.headingSmall,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    gap: 12,
  },
});
