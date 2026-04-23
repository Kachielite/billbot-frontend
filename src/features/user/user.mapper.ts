import { UserProfileDto, UserResponse, UserSummaryDto } from '@/features/user/user.dto';
import { IUser, UserProfile, UserSummary } from '@/features/user/user.interface';

export const mapUserResponseToUser = (response: UserResponse): IUser => {
  return {
    id: response.id,
    email: response.email,
    name: response.name,
    avatarUrl: response.avatar_url,
    createdAt: response.created_at,
  };
};

export const mapUserProfileFromDto = (dto: UserProfileDto): UserProfile => ({
  id: dto.id,
  name: dto.name,
  phone: dto.phone,
  email: dto.email,
  avatarUrl: dto.avatar_url,
  currency: dto.currency,
  createdAt: new Date(dto.created_at),
});

export const mapUserSummaryFromDto = (dto: UserSummaryDto): UserSummary => ({
  id: dto.id,
  name: dto.name,
  email: dto.email,
  avatarUrl: dto.avatar_url,
});
