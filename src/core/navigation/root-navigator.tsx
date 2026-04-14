import React from 'react';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import AuthScreen from '@/features/auth/auth.screen';
import { createBottomTabNavigator, createBottomTabScreen } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/features/home/home.screen';
import { Platform } from 'react-native';
import ActivityScreen from '@/features/activity/activity.screen';
import GroupScreen from '@/features/groups/screens/group.screen';
import ProfileScreen from '@/features/user/screens/profile.screen';
import { isLiquidGlassSupported } from '@callstack/liquid-glass';
import useAuthStore from '@/features/auth/auth.state';

const Tabs = createBottomTabNavigator({
  screens: {
    Home: createBottomTabScreen({
      screen: HomeScreen,
      options: {
        title: 'Home',
        tabBarIcon: Platform.select({
          ios: { type: 'sfSymbol', name: 'house.fill' },
          android: { type: 'materialSymbol', name: 'home' },
        }),
      },
    }),
    Activity: createBottomTabScreen({
      screen: ActivityScreen,
      options: {
        title: 'Activity',
        tabBarIcon: Platform.select({
          ios: { type: 'sfSymbol', name: 'chart.bar.fill' },
          android: { type: 'materialSymbol', name: 'trending_up' },
        }),
      },
    }),
    Groups: createBottomTabScreen({
      screen: GroupScreen,
      options: {
        title: 'Groups',
        tabBarIcon: Platform.select({
          ios: { type: 'sfSymbol', name: 'person.3.fill' },
          android: { type: 'materialSymbol', name: 'groups' },
        }),
        tabBarStyle: {
          backgroundColor: isLiquidGlassSupported ? 'transparent' : undefined,
        },
      },
    }),
    Profile: createBottomTabScreen({
      screen: ProfileScreen,
      options: {
        title: 'Profile',
        tabBarIcon: Platform.select({
          ios: { type: 'sfSymbol', name: 'person.fill' },
          android: { type: 'materialSymbol', name: 'person' },
        }),
      },
    }),
  },
});

const AuthenticatedStack = createNativeStackNavigator({
  screens: {
    Tabs: createNativeStackScreen({
      screen: Tabs,
      options: {
        title: 'Tabs',
        headerShown: false,
      },
    }),
  },
});

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

const AuthenticatedNavigation = createStaticNavigation(AuthenticatedStack);
const UnauthenticatedNavigation = createStaticNavigation(UnauthenticatedStack);

export const Navigation = () => {
  const token = useAuthStore((state) => state.token);

  return token !== null ? <AuthenticatedNavigation /> : <UnauthenticatedNavigation />;
};
