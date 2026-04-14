export type SettlementStatus = 'pending_verification' | 'settled' | 'disputed';

export interface Settlement {
  id: string;
  poolId: string | null;
  fromUser: string | null;
  toUser: string | null;
  amount: number;
  currency: string;
  proofUrl: string | null;
  note: string | null;
  status: SettlementStatus;
  disputedReason: string | null;
  confirmedAt: Date | null;
  createdAt: Date;
}
