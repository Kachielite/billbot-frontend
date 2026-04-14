import { InviteDto } from './invites.dto';
import { Invite } from './invites.interface';

export const mapInviteFromDto = (dto: InviteDto): Invite => ({
  id: dto.id,
  groupId: dto.group_id,
  invitedBy: dto.invited_by,
  phone: dto.phone,
  email: dto.email,
  token: dto.token,
  status: dto.status,
  expiresAt: new Date(dto.expires_at),
  createdAt: new Date(dto.created_at),
});
