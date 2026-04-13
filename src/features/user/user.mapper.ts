import { UserResponse } from '@/features/user/user.dto';
import { IUser } from '@/features/user/user.interface';

export const mapUserResponseToUser = (response: UserResponse): IUser => {
  return {
    id: response.id,
    email: response.email,
    name: response.name,
    avatarUrl: response.avatar_url,
    createdAt: response.created_at,
  };
};
