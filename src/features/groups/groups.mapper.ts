import { GroupDetailDto, GroupDto, GroupMemberDto, PaginatedGroupsDto } from './groups.dto';
import { Group, GroupDetail, GroupMember, PaginatedGroups } from './groups.interface';

export const mapGroupMemberFromDto = (dto: GroupMemberDto): GroupMember => ({
  userId: dto.user_id,
  name: dto.name,
  email: dto.email,
  avatarUrl: dto.avatar_url,
  role: dto.role,
  joinedAt: new Date(dto.joined_at),
});

export const mapGroupFromDto = (dto: GroupDto): Group => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  emoji: dto.emoji,
  color: dto.color,
  inviteCode: dto.invite_code,
  createdBy: dto.created_by,
  createdAt: new Date(dto.created_at),
  memberCount: dto.member_count,
  members: dto.members?.map(mapGroupMemberFromDto),
  balance: dto.balance
    ? {
        totalOwed: dto.balance.total_owed,
        totalOwedToMe: dto.balance.total_owed_to_me,
        netBalance: dto.balance.net_balance,
        currency: dto.balance.currency,
      }
    : undefined,
});

export const mapGroupDetailFromDto = (dto: GroupDetailDto): GroupDetail => ({
  ...mapGroupFromDto(dto),
  members: dto.members.map(mapGroupMemberFromDto),
});

export const mapPaginatedGroupsFromDto = (dto: PaginatedGroupsDto): PaginatedGroups => ({
  page: dto.page,
  limit: dto.limit,
  totalItems: dto.total_items,
  pages: dto.pages,
  groups: dto.items.map(mapGroupFromDto),
});
