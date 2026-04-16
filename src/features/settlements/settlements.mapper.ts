import { SettlementDto } from './settlements.dto';
import { Settlement } from './settlements.interface';

export const mapSettlementFromDto = (dto: SettlementDto): Settlement => ({
  id: dto.id,
  poolId: dto.pool_id,
  fromUser: dto.from_user,
  toUser: dto.to_user,
  amount: parseFloat(dto.amount),
  currency: dto.currency,
  proofUrl: dto.proof_url,
  note: dto.note,
  status: dto.status,
  disputedReason: dto.disputed_reason,
  confirmedAt: dto.confirmed_at ? new Date(dto.confirmed_at) : null,
  createdAt: new Date(dto.created_at),
});
