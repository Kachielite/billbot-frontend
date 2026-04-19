import { PoolBalancesDto, UserBalancesDto } from './balances.dto';
import { PoolBalances, UserBalances } from './balances.interface';

export const mapPoolBalancesFromDto = (dto: PoolBalancesDto): PoolBalances => ({
  balances: dto.balances.map((b) => ({
    from: { id: b.from.id, name: b.from.name, email: null, avatarUrl: null },
    to: { id: b.to.id, name: b.to.name, email: null, avatarUrl: null },
    amount: b.amount,
    currency: b.currency,
  })),
  memberSummary: dto.member_summary.map((m) => ({
    user: { id: m.user.id, name: m.user.name, email: null, avatarUrl: null },
    totalPaid: m.total_paid,
    totalOwed: m.total_owed,
    netBalance: m.net_balance,
  })),
});

export const mapUserBalancesFromDto = (dto: UserBalancesDto): UserBalances => ({
  totalOwed: dto.total_owed,
  totalOwedToMe: dto.total_owed_to_me,
  currency: dto.currency,
});
