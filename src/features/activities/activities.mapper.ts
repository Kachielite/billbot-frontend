import { ActivityActorDto, ActivityDto, ActivityPoolDto } from './activities.dto';
import { Activity, ActivityActor, ActivityPool } from './activities.interface';

const mapActor = (dto: ActivityActorDto | null): ActivityActor | null =>
  dto ? { id: dto.id, name: dto.name, avatarUrl: dto.avatar_url } : null;

const mapPool = (dto: ActivityPoolDto | null): ActivityPool | null =>
  dto ? { id: dto.id, name: dto.name } : null;

export const mapActivityFromDto = (dto: ActivityDto): Activity => {
  const base = {
    id: dto.id,
    actor: mapActor(dto.actor),
    pool: mapPool(dto.pool),
    createdAt: new Date(dto.created_at),
  };

  switch (dto.type) {
    case 'expense.created':
      return {
        ...base,
        type: 'expense.created',
        metadata: {
          expenseId: dto.metadata.expense_id,
          amount: dto.metadata.amount,
          currency: dto.metadata.currency,
          description: dto.metadata.description,
          category: dto.metadata.category
            ? {
                id: dto.metadata.category.id,
                name: dto.metadata.category.name,
                emoji: dto.metadata.category.emoji,
              }
            : null,
        },
      };

    case 'expense.deleted':
      return {
        ...base,
        type: 'expense.deleted',
        metadata: { expenseId: dto.metadata.expense_id },
      };

    case 'pool.created':
      return {
        ...base,
        type: 'pool.created',
        metadata: { poolName: dto.metadata.pool_name },
      };

    case 'pool.settled':
      return { ...base, type: 'pool.settled', metadata: {} };

    case 'pool.member_added':
      return {
        ...base,
        type: 'pool.member_added',
        metadata: { targetUserId: dto.metadata.target_user_id },
      };

    case 'pool.member_removed':
      return {
        ...base,
        type: 'pool.member_removed',
        metadata: { targetUserId: dto.metadata.target_user_id },
      };

    case 'settlement.submitted':
      return {
        ...base,
        type: 'settlement.submitted',
        metadata: {
          settlementId: dto.metadata.settlement_id,
          amount: dto.metadata.amount,
          currency: dto.metadata.currency,
          toUserId: dto.metadata.to_user_id,
        },
      };

    case 'settlement.confirmed':
      return {
        ...base,
        type: 'settlement.confirmed',
        metadata: {
          settlementId: dto.metadata.settlement_id,
          amount: dto.metadata.amount,
          currency: dto.metadata.currency,
          fromUserId: dto.metadata.from_user_id,
        },
      };

    case 'settlement.disputed':
      return {
        ...base,
        type: 'settlement.disputed',
        metadata: {
          settlementId: dto.metadata.settlement_id,
          reason: dto.metadata.reason,
        },
      };
  }
};
