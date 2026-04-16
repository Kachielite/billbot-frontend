import React from 'react';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import AuthScreen from '@/features/auth/auth.screen';
import { createBottomTabNavigator, createBottomTabScreen } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/features/home/home.screen';
import { Platform, useColorScheme } from 'react-native';
import ActivitiesScreen from '@/features/activities/activities.screen';
import GroupsScreen from '@/features/groups/screens/groups.screen';
import ProfileScreen from '@/features/user/screens/profile.screen';
import { isLiquidGlassSupported } from '@callstack/liquid-glass';
import useAuthStore from '@/features/auth/auth.state';
import type { Theme } from '@react-navigation/native';
import { LightColors, DarkColors } from '@/core/common/constants/theme';

interface NavigationProps {
  theme?: Theme;
}

// Create tabs navigator definition outside component
const createTabsNavigator = (colorScheme: string | null) => {
  const isDark = colorScheme === 'dark';
  const colors = isDark ? DarkColors : LightColors;

  return createBottomTabNavigator({
    screens: {
      Home: createBottomTabScreen({
        screen: HomeScreen,
        options: {
          title: 'Home',
          tabBarIcon: ({ focused }) =>
            Platform.select({
              ios: { type: 'sfSymbol', name: focused ? 'house.fill' : 'house' },
              android: { type: 'materialSymbol', name: 'home' },
            }),
        },
      }),
      Activity: createBottomTabScreen({
        screen: ActivitiesScreen,
        options: {
          title: 'Activity',
          tabBarIcon: ({ focused }) =>
            Platform.select({
              ios: { type: 'sfSymbol', name: focused ? 'chart.bar.fill' : 'chart.bar' },
              android: { type: 'materialSymbol', name: 'trending_up' },
            }),
        },
      }),
      Groups: createBottomTabScreen({
        screen: GroupsScreen,
        options: {
          title: 'Groups',
          tabBarIcon: ({ focused }) =>
            Platform.select({
              ios: { type: 'sfSymbol', name: focused ? 'person.3.fill' : 'person.3' },
              android: { type: 'materialSymbol', name: 'group' },
            }),
        },
      }),
      Profile: createBottomTabScreen({
        screen: ProfileScreen,
        options: {
          title: 'Profile',
          tabBarIcon: ({ focused }) =>
            Platform.select({
              ios: { type: 'sfSymbol', name: focused ? 'person.fill' : 'person' },
              android: { type: 'materialSymbol', name: 'person' },
            }),
        },
      }),
    },
    screenOptions: {
      headerShown: false,
      tabBarStyle: {
        backgroundColor: isLiquidGlassSupported ? 'transparent' : colors.surface,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.text.secondary,
    },
  });
};

const UnauthenticatedStack = createNativeStackNavigator({
  screens: {
    Authentication: createNativeStackScreen({
      screen: AuthScreen,
      options: {
        title: 'Authentication',
        headerShown: false,
      },
    }),
  },
});

const UnauthenticatedNavigation = createStaticNavigation(UnauthenticatedStack);

export function Navigation({ theme }: NavigationProps): React.JSX.Element {
  const token = useAuthStore((state) => state.token);
  const colorScheme = useColorScheme();

  // Create TabsNavigator with current color scheme
  const Tabs = createTabsNavigator(colorScheme);
  const TabsNavigation = createStaticNavigation(
    createNativeStackNavigator({
      screens: {
        Tabs: createNativeStackScreen({
          screen: Tabs,
          options: {
            title: 'Tabs',
            headerShown: false,
          },
        }),
      },
    }),
  );

  return token !== null ? (
    <TabsNavigation theme={theme} />
  ) : (
    <UnauthenticatedNavigation theme={theme} />
  );
}
