import { PoolBalancesDto } from './balances.dto';
import { PoolBalances } from './balances.interface';

export const mapPoolBalancesFromDto = (dto: PoolBalancesDto): PoolBalances => ({
  balances: dto.balances.map((b) => ({
    from: { id: b.from.id, name: b.from.name, email: null, avatarUrl: null },
    to: { id: b.to.id, name: b.to.name, email: null, avatarUrl: null },
    amount: b.amount,
    currency: b.currency,
  })),
  memberSummary: dto.memberSummary.map((m) => ({
    user: { id: m.user.id, name: m.user.name, email: null, avatarUrl: null },
    totalPaid: m.totalPaid,
    totalOwed: m.totalOwed,
    netBalance: m.netBalance,
  })),
});
