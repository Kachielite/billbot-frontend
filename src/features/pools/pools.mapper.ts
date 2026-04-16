import { PoolDetailDto, PoolDto, PoolMemberDto } from './pools.dto';
import { Pool, PoolDetail, PoolMember } from './pools.interface';

export const mapPoolFromDto = (dto: PoolDto): Pool => ({
  id: dto.id,
  groupId: dto.group_id,
  name: dto.name,
  description: dto.description,
  status: dto.status,
  splitType: dto.split_type,
  createdBy: dto.created_by,
  createdAt: new Date(dto.created_at),
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
