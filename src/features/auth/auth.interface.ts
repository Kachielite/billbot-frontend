import { IGeneralResponse } from '@/core/common/interface';
import { IUser } from '@/features/user/user.interface';

export interface IAuth extends IGeneralResponse {
  data: {
    token: string;
    user: IUser;
  };
}
