import { GroupDetailDto, GroupDto, GroupMemberDto, PaginatedGroupsDto } from './groups.dto';
import { Group, GroupDetail, GroupMember, PaginatedGroups } from './groups.interface';

export const mapGroupMemberFromDto = (dto: GroupMemberDto): GroupMember => {
  const raw = dto as any;
  return {
    userId: dto.user_id ?? raw.userId,
    name: dto.name,
    email: dto.email,
    avatarUrl: dto.avatar_url ?? raw.avatarUrl,
    role: dto.role,
    joinedAt: new Date(dto.joined_at ?? raw.joinedAt),
  };
};

export const mapGroupFromDto = (dto: GroupDto): Group => {
  const raw = dto as any;
  const balance = dto.balance ?? raw.balance;
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    emoji: dto.emoji,
    color: dto.color,
    inviteCode: dto.invite_code ?? raw.inviteCode,
    createdBy: dto.created_by ?? raw.createdBy,
    createdAt: new Date(dto.created_at ?? raw.createdAt),
    memberCount: dto.member_count ?? raw.memberCount,
    members: (dto.members ?? raw.members)?.map(mapGroupMemberFromDto),
    balance: balance
      ? {
          totalOwed: balance.total_owed ?? balance.totalOwed,
          totalOwedToMe: balance.total_owed_to_me ?? balance.totalOwedToMe,
          netBalance: balance.net_balance ?? balance.netBalance,
          currency: balance.currency,
        }
      : undefined,
  };
};

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
