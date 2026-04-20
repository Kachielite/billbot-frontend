import { PaginatedPoolsDto, PoolDetailDto, PoolDto, PoolMemberDto } from './pools.dto';
import { PaginatedPools, Pool, PoolDetail, PoolMember } from './pools.interface';

export const mapPoolFromDto = (dto: PoolDto): Pool => ({
  id: dto.id,
  groupId: dto.group_id,
  name: dto.name,
  description: dto.description,
  status: dto.status,
  activityStatus: dto.activity_status,
  expenseCount: dto.expense_count,
  balance: dto.balance
    ? {
        totalOwed: dto.balance.total_owed,
        totalOwedToMe: dto.balance.total_owed_to_me,
        netBalance: dto.balance.net_balance,
        currency: dto.balance.currency,
      }
    : undefined,
  splitType: dto.split_type,
  createdBy: dto.created_by,
  createdAt: new Date(dto.created_at),
});

export const mapPaginatedPoolsFromDto = (dto: PaginatedPoolsDto): PaginatedPools => ({
  page: dto.page,
  limit: dto.limit,
  totalItems: dto.total_items,
  pages: dto.pages,
  pools: dto.items.map(mapPoolFromDto),
});

export const mapPoolMemberFromDto = (dto: PoolMemberDto): PoolMember => ({
  poolId: dto.pool_id,
  userId: dto.user_id,
  joinedAt: new Date(dto.joined_at),
});

export const mapPoolDetailFromDto = (dto: PoolDetailDto): PoolDetail => ({
  ...mapPoolFromDto(dto),
  members: dto.members.map(mapPoolMemberFromDto),
});
