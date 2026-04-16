// ── Request params ────────────────────────────────────────────────────────────
export interface GetActivitiesParamsDto {
  page?: number;
  limit?: number;
  pool_id?: string;
  group_id?: string;
  from?: string;
  to?: string;
}

// ── Shared nested DTOs ────────────────────────────────────────────────────────
export interface ActivityActorDto {
  id: string;
  name: string;
  avatar_url: string | null;
}

export interface ActivityPoolDto {
  id: string;
  name: string;
}

export interface ActivityCategoryDto {
  id: string;
  name: string;
  emoji: string;
}

// ── Per-type metadata DTOs ────────────────────────────────────────────────────
export interface ExpenseCreatedMetadataDto {
  expense_id: string;
  amount: number;
  currency: string;
  description: string | null;
  category: ActivityCategoryDto | null;
}

export interface ExpenseDeletedMetadataDto {
  expense_id: string;
}

export interface PoolCreatedMetadataDto {
  pool_name: string;
}

export type PoolSettledMetadataDto = Record<string, never>;

export interface PoolMemberAddedMetadataDto {
  target_user_id: string;
}

export interface PoolMemberRemovedMetadataDto {
  target_user_id: string;
}

export interface SettlementSubmittedMetadataDto {
  settlement_id: string;
  amount: number;
  currency: string;
  to_user_id: string;
}

export interface SettlementConfirmedMetadataDto {
  settlement_id: string;
  amount: number;
  currency: string;
  from_user_id: string;
}

export interface SettlementDisputedMetadataDto {
  settlement_id: string;
  reason: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────
interface ActivityDtoBase {
  id: string;
  actor: ActivityActorDto | null;
  pool: ActivityPoolDto | null;
  created_at: string;
}

export type ActivityDto =
  | (ActivityDtoBase & { type: 'expense.created'; metadata: ExpenseCreatedMetadataDto })
  | (ActivityDtoBase & { type: 'expense.deleted'; metadata: ExpenseDeletedMetadataDto })
  | (ActivityDtoBase & { type: 'pool.created'; metadata: PoolCreatedMetadataDto })
  | (ActivityDtoBase & { type: 'pool.settled'; metadata: PoolSettledMetadataDto })
  | (ActivityDtoBase & { type: 'pool.member_added'; metadata: PoolMemberAddedMetadataDto })
  | (ActivityDtoBase & { type: 'pool.member_removed'; metadata: PoolMemberRemovedMetadataDto })
  | (ActivityDtoBase & { type: 'settlement.submitted'; metadata: SettlementSubmittedMetadataDto })
  | (ActivityDtoBase & { type: 'settlement.confirmed'; metadata: SettlementConfirmedMetadataDto })
  | (ActivityDtoBase & { type: 'settlement.disputed'; metadata: SettlementDisputedMetadataDto });
