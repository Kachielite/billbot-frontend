import React from 'react';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import type { Theme } from '@react-navigation/native';
import { createStaticNavigation } from '@react-navigation/native';
import AuthScreen from '@/features/auth/auth.screen';
import { createBottomTabNavigator, createBottomTabScreen } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/features/home/home.screen';
import { Platform } from 'react-native';
import ActivitiesScreen from '@/features/activities/activities.screen';
import GroupsScreen from '@/features/groups/screens/groups.screen';
import ProfileScreen from '@/features/user/screens/profile.screen';
import useAuthStore from '@/features/auth/auth.state';
import NewGroupScreen from '@/features/groups/screens/new-group.screen';
import EditGroupScreen from '@/features/groups/screens/edit-group.screen';
import ManageMembersScreen from '@/features/groups/screens/manage-members.screen';
import InviteMembersScreen from '@/features/invites/screens/invite-members.screen';
import { BrandColors, DarkColors, LightColors } from '@/core/common/constants/theme';
import NewExpenseScreen from '@/features/expenses/screens/new-expense.screen';
import GroupScreen from '@/features/groups/screens/group.screen';
import NewPoolScreen from '@/features/pools/screens/new-pool.screen';
import PoolScreen from '@/features/pools/screens/pool.screen';
import PoolsScreen from '@/features/pools/screens/pools.screen';
import EditPoolScreen from '@/features/pools/screens/edit-pool.screen';
import NewExpenseHomeScreen from '@/features/expenses/screens/new-expense-home.screen';
import ExpensesScreen from '@/features/expenses/screens/expenses.screen';
import ExpenseScreen from '@/features/expenses/screens/expense.screen';
import UpcomingExpensesScreen from '@/features/expenses/screens/upcoming-expenses.screen';
import SettlementsScreen from '@/features/settlements/screens/settlements.screen';
import SettlementScreen from '@/features/settlements/screens/settlement.screen';
import RecordPaymentScreen from '@/features/settlements/screens/record-payment.screen';
import SettleUpHomeScreen from '@/features/settlements/screens/settle-up-home.screen';
import DisputeSettlementScreen from '@/features/settlements/screens/dispute-settlement.screen';
import NotificationsScreen from '@/features/notifications/screens/notifications.screen';
import JoinGroupTokenScreen from '@/features/invites/screens/join-group-token.screen';
import JoinGroupCodeScreen from '@/features/invites/screens/join-group-code.screen';

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

const createAuthenticatedStack = (sheetBackgroundColor: string) =>
  createNativeStackNavigator({
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
      NewExpenseHome: {
        screen: NewExpenseHomeScreen,
        options: {
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          animationDuration: 50,
        },
      },
      NewExpense: {
        screen: NewExpenseScreen,
        options: {
          headerShown: false,
          presentation: 'card',
        },
      },
      Expenses: {
        screen: ExpensesScreen,
        options: {
          headerShown: false,
        },
      },
      UpcomingExpenses: {
        screen: UpcomingExpensesScreen,
        options: {
          headerShown: false,
        },
      },
      Expense: {
        screen: ExpenseScreen,
        options: {
          headerShown: false,
        },
      },
      NewPool: {
        screen: NewPoolScreen,
        options: {
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          animationDuration: 50,
        },
      },
      EditPool: {
        screen: EditPoolScreen,
        options: {
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          animationDuration: 50,
        },
      },
      Pool: {
        screen: PoolScreen,
        options: {
          headerShown: false,
        },
      },
      Pools: {
        screen: PoolsScreen,
        options: {
          headerShown: false,
        },
      },
      SettleUpHome: {
        screen: SettleUpHomeScreen,
        options: {
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          animationDuration: 50,
        },
      },
      DisputeSettlement: {
        screen: DisputeSettlementScreen,
        options: {
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          animationDuration: 50,
          contentStyle: { backgroundColor: 'transparent' },
        },
      },
      Settlements: {
        screen: SettlementsScreen,
        options: {
          headerShown: false,
        },
      },
      Settlement: {
        screen: SettlementScreen,
        options: {
          headerShown: false,
        },
      },
      RecordPayment: {
        screen: RecordPaymentScreen,
        options: {
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          animationDuration: 50,
        },
      },
      Notifications: {
        screen: NotificationsScreen,
        options: {
          headerShown: false,
        },
      },
      JoinGroupByToken: {
        screen: JoinGroupTokenScreen,
        options: {
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          animationDuration: 50,
          contentStyle: { backgroundColor: 'transparent' },
        },
      },
      JoinGroupByCode: {
        screen: JoinGroupCodeScreen,
        options: {
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          animationDuration: 50,
          contentStyle: { backgroundColor: 'transparent' },
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

const UnauthenticatedNavigation = createStaticNavigation(UnauthenticatedStack);

export function Navigation({ theme }: NavigationProps): React.JSX.Element {
  const token = useAuthStore((state) => state.token);
  const sheetBackgroundColor = theme?.dark ? DarkColors.background : LightColors.background;

  const AuthenticatedStack = React.useMemo(
    () => createAuthenticatedStack(sheetBackgroundColor),
    [sheetBackgroundColor],
  );

  const TabsNavigation = React.useMemo(
    () => createStaticNavigation(AuthenticatedStack),
    [AuthenticatedStack],
  );

  return token !== null ? (
    <TabsNavigation theme={theme} />
  ) : (
    <UnauthenticatedNavigation theme={theme} />
  );
}

type AuthenticatedStackType = ReturnType<typeof createAuthenticatedStack>;

declare module '@react-navigation/core' {
  // Required module augmentation pattern for React Navigation static API root typing.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RootNavigator extends AuthenticatedStackType {}
}
