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
  totalAmount: number;
  amountCollected: number;
  outstanding: number;
  balances: BalanceEntry[];
  memberSummary: MemberSummary[];
}

export interface UserBalances {
  totalOwed: number;
  totalOwedToMe: number;
  currency: string;
}
