export interface BalanceEntryDto {
  from: { id: string; name: string };
  to: { id: string; name: string };
  amount: number;
  currency: string;
}

export interface MemberSummaryDto {
  user: { id: string; name: string };
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
}

export interface PoolBalancesDto {
  balances: BalanceEntryDto[];
  memberSummary: MemberSummaryDto[];
}
