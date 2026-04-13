import { AuthResponse } from '@/features/auth/auth.dto';
import { IAuth } from '@/features/auth/auth.interface';
import { mapUserResponseToUser } from '@/features/user/user.mapper';

export const mapAuthResponseToAuth = (response: AuthResponse): IAuth => {
  return {
    success: response.success,
    data: {
      token: response.data.token,
      user: mapUserResponseToUser(response.data.user),
    },
  };
};
