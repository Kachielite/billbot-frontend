// ── Shared nested types ───────────────────────────────────────────────────────
export interface ActivityActor {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface ActivityPool {
  id: string;
  name: string;
}

export interface ActivityCategory {
  id: string;
  name: string;
  emoji: string;
}

// ── Per-type metadata ─────────────────────────────────────────────────────────
export interface ExpenseCreatedMetadata {
  expenseId: string;
  amount: number;
  currency: string;
  description: string | null;
  category: ActivityCategory | null;
}

export interface ExpenseDeletedMetadata {
  expenseId: string;
}

export interface PoolCreatedMetadata {
  poolName: string;
}

export type PoolSettledMetadata = Record<string, never>;

export interface PoolMemberAddedMetadata {
  targetUserId: string;
}

export interface PoolMemberRemovedMetadata {
  targetUserId: string;
}

export interface SettlementSubmittedMetadata {
  settlementId: string;
  amount: number;
  currency: string;
  toUserId: string;
}

export interface SettlementConfirmedMetadata {
  settlementId: string;
  amount: number;
  currency: string;
  fromUserId: string;
}

export interface SettlementDisputedMetadata {
  settlementId: string;
  reason: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────
interface ActivityBase {
  id: string;
  actor: ActivityActor | null;
  pool: ActivityPool | null;
  createdAt: Date;
}

export type Activity =
  | (ActivityBase & { type: 'expense.created'; metadata: ExpenseCreatedMetadata })
  | (ActivityBase & { type: 'expense.deleted'; metadata: ExpenseDeletedMetadata })
  | (ActivityBase & { type: 'pool.created'; metadata: PoolCreatedMetadata })
  | (ActivityBase & { type: 'pool.settled'; metadata: PoolSettledMetadata })
  | (ActivityBase & { type: 'pool.member_added'; metadata: PoolMemberAddedMetadata })
  | (ActivityBase & { type: 'pool.member_removed'; metadata: PoolMemberRemovedMetadata })
  | (ActivityBase & { type: 'settlement.submitted'; metadata: SettlementSubmittedMetadata })
  | (ActivityBase & { type: 'settlement.confirmed'; metadata: SettlementConfirmedMetadata })
  | (ActivityBase & { type: 'settlement.disputed'; metadata: SettlementDisputedMetadata });
