import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import AuthScreen from '@/features/auth/auth.screen';

type RootStackType = typeof RootStack;

// This is needed to type-check hooks such as useNavigation, useRoute, useNavigationState, etc
declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}

const RootStack = createNativeStackNavigator({
  screens: {
    Authentication: createNativeStackScreen({
      screen: AuthScreen,
      options: {
        headerShown: false,
      },
    }),
  },
});

export const Navigation = createStaticNavigation(RootStack);
