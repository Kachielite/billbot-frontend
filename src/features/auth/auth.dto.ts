import { IGeneralResponse } from '@/core/common/interface';
import { UserResponse } from '@/features/user/user.dto';
import { AppleAuthSchema, GoogleAuthSchema } from '@/features/auth/auth.validator';
import z from 'zod';

export interface AuthResponse extends IGeneralResponse {
  data: {
    token: string;
    user: UserResponse;
  };
}

export type GoogleAuthRequest = z.infer<typeof GoogleAuthSchema>;

export type AppleAuthRequest = z.infer<typeof AppleAuthSchema>;
