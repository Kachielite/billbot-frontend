export interface BalanceEntryDto {
  from: { id: string; name: string };
  to: { id: string; name: string };
  amount: number;
  currency: string;
}

export interface MemberSummaryDto {
  user: { id: string; name: string };
  total_paid: number;
  total_owed: number;
  net_balance: number;
}

export interface PoolBalancesDto {
  total_amount: number;
  amount_collected: number;
  outstanding: number;
  balances: BalanceEntryDto[];
  member_summary: MemberSummaryDto[];
}

export interface UserBalancesDto {
  total_owed: number;
  total_owed_to_me: number;
  currency: string;
}
