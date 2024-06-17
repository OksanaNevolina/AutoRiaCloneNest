import { AccountTypeEnum } from '../../../database/enums/account-type.enum';
import { RoleEnum } from '../../../database/enums/role-enum';

export interface IUserData {
  userId: string;
  email: string;
  role: RoleEnum;
  accountType: AccountTypeEnum;
}
