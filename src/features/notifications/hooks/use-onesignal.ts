import React from 'react';
import { Platform } from 'react-native';
import { OneSignal, NotificationClickEvent } from 'react-native-onesignal';
import ENV from '@/core/common/constants/env';
import { navigationRef } from '@/core/navigation';
import { NotificationsService } from '../notifications.service';
import { PushNotificationData } from '../notifications.push.interface';

const useOnesignal = (isAuthenticated: boolean) => {
  React.useEffect(() => {
    OneSignal.initialize(ENV.ONESIGNAL_APP_ID);
    OneSignal.Notifications.requestPermission(true);
  }, []);

  // Register device token whenever the user becomes authenticated
  React.useEffect(() => {
    if (!isAuthenticated) return;

    const register = async () => {
      try {
        const playerId = await OneSignal.User.pushSubscription.getIdAsync();
        if (playerId) {
          const platform = Platform.OS === 'ios' ? 'ios' : 'android';
          await NotificationsService.registerDeviceToken(playerId, platform);
        }
      } catch {
        // Non-critical
      }
    };

    register();
  }, [isAuthenticated]);

  // Deep link handler — fires when user taps a notification
  React.useEffect(() => {
    const handler = (event: NotificationClickEvent) => {
      const data = event.notification.additionalData as PushNotificationData | undefined;
      if (!data?.type || !navigationRef.isReady()) return;

      const nav = navigationRef as any;

      switch (data.type) {
        case 'invite.received':
          if (data.group_id && data.invite_token) {
            nav.navigate('JoinGroupByToken', { token: data.invite_token, groupId: data.group_id });
          }
          break;
        case 'member.joined':
          if (data.group_id) {
            nav.navigate('Group', { groupId: data.group_id });
          }
          break;
        case 'expense.created':
          if (data.expense_id && data.pool_id) {
            nav.navigate('Expense', { expenseId: data.expense_id, poolId: data.pool_id });
          }
          break;
        case 'settlement.submitted':
        case 'settlement.confirmed':
        case 'settlement.disputed':
          if (data.settlement_id && data.pool_id) {
            nav.navigate('Settlement', { settlementId: data.settlement_id, poolId: data.pool_id });
          }
          break;
      }
    };

    OneSignal.Notifications.addEventListener('click', handler);
    return () => OneSignal.Notifications.removeEventListener('click', handler);
  }, []);
};

export default useOnesignal;
