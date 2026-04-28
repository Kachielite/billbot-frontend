export type NotificationType =
  | 'invite.received'
  | 'expense.created'
  | 'expense.deleted'
  | 'upcoming.expense'
  | 'settlement.submitted'
  | 'settlement.confirmed'
  | 'settlement.disputed'
  | 'member.joined'
  | 'member.removed'
  | 'pool.created'
  | 'pool.settled'
  | string;

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}
