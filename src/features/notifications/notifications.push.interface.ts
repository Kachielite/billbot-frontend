export type PushNotificationType =
  | 'invite.received'
  | 'member.joined'
  | 'expense.created'
  | 'settlement.submitted'
  | 'settlement.confirmed'
  | 'settlement.disputed';

export interface PushNotificationData {
  type: PushNotificationType;
  group_id?: string;
  invite_token?: string;
  expense_id?: string;
  pool_id?: string;
  settlement_id?: string;
}

export interface NotificationPreferences {
  user_id: string;
  invite_received: boolean;
  member_joined: boolean;
  expense_created: boolean;
  settlement_submitted: boolean;
  settlement_confirmed: boolean;
  settlement_disputed: boolean;
  general: boolean;
}

export type NotificationPreferencesUpdate = Partial<Omit<NotificationPreferences, 'user_id'>>;
