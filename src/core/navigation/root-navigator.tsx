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
import ActivitiesScreen from '@/features/activities/activities.screen';
import GroupsScreen from '@/features/groups/screens/groups.screen';
import ProfileScreen from '@/features/user/screens/profile.screen';
import { isLiquidGlassSupported } from '@callstack/liquid-glass';
import useAuthStore from '@/features/auth/auth.state';
import type { Theme } from '@react-navigation/native';
import NewGroupScreen from '@/features/groups/screens/new-group.screen';
import EditGroupScreen from '@/features/groups/screens/edit-group.screen';
import ManageMembersScreen from '@/features/groups/screens/manage-members.screen';
import InviteMembersScreen from '@/features/invites/screens/invite-members.screen';
import { BrandColors } from '@/core/common/constants/theme';
import NewExpenseScreen from '@/features/expenses/screens/new-expense.screen';
import GroupScreen from '@/features/groups/screens/group.screen';
import NewPoolScreen from '@/features/pools/screens/new-pool.screen';

interface NavigationProps {
  theme?: Theme;
}

const Tabs = createBottomTabNavigator({
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
    tabBarShowLabel: true,
    tabBarActiveTintColor: BrandColors.primary,
    animation: Platform.OS === 'android' ? 'fade' : 'shift',
  },
});

const AuthenticatedStack = createNativeStackNavigator({
  screens: {
    Tabs: {
      screen: Tabs,
      options: {
        title: 'Tabs',
        headerShown: false,
      },
    },
    NewGroup: {
      screen: NewGroupScreen,
      options: {
        headerShown: false,
      },
    },
    Group: {
      screen: GroupScreen,
      options: {
        headerShown: false,
      },
    },
    InviteMembers: {
      screen: InviteMembersScreen,
      options: {
        headerShown: false,
      },
    },
    EditGroup: {
      screen: EditGroupScreen,
      options: { headerShown: false },
    },
    ManageMembers: {
      screen: ManageMembersScreen,
      options: { headerShown: false },
    },
    NewExpense: {
      screen: NewExpenseScreen,
      options: {
        headerShown: false,
      },
    },
    NewPool: {
      screen: NewPoolScreen,
      options: {
        headerShown: false,
      },
    },
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

const TabsNavigation = createStaticNavigation(AuthenticatedStack);
const UnauthenticatedNavigation = createStaticNavigation(UnauthenticatedStack);

export function Navigation({ theme }: NavigationProps): React.JSX.Element {
  const token = useAuthStore((state) => state.token);

  return token !== null ? (
    <TabsNavigation theme={theme} />
  ) : (
    <UnauthenticatedNavigation theme={theme} />
  );
}

type AuthenticatedStackType = typeof AuthenticatedStack;

declare module '@react-navigation/core' {
  // Required module augmentation pattern for React Navigation static API root typing.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RootNavigator extends AuthenticatedStackType {}
}
