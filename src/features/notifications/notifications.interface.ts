export type NotificationType =
  | 'invite.received'
  | 'expense.created'
  | 'settlement.submitted'
  | 'settlement.confirmed'
  | 'settlement.disputed'
  | 'member.joined'
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
