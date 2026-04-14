import type { UserSummary } from '@/features/user/user.interface';

export interface BalanceEntry {
  from: UserSummary;
  to: UserSummary;
  amount: number;
  currency: string;
}

export interface MemberSummary {
  user: UserSummary;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
}

export interface PoolBalances {
  balances: BalanceEntry[];
  memberSummary: MemberSummary[];
}
