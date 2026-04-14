import { GroupDetailDto, GroupDto, GroupMemberDto } from './groups.dto';
import { Group, GroupDetail, GroupMember } from './groups.interface';

export const mapGroupFromDto = (dto: GroupDto): Group => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  inviteCode: dto.invite_code,
  createdBy: dto.created_by,
  createdAt: new Date(dto.created_at),
});

export const mapGroupMemberFromDto = (dto: GroupMemberDto): GroupMember => ({
  userId: dto.user_id,
  name: dto.name,
  email: dto.email,
  avatarUrl: dto.avatar_url,
  role: dto.role,
  joinedAt: new Date(dto.joined_at),
});

export const mapGroupDetailFromDto = (dto: GroupDetailDto): GroupDetail => ({
  ...mapGroupFromDto(dto),
  members: dto.members.map(mapGroupMemberFromDto),
});
