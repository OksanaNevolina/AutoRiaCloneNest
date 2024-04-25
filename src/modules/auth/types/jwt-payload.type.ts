import { RoleEnum } from '../../../database/enums/role-enum';

export type JwtPayload = {
  userId: string;
  role: RoleEnum;
};
