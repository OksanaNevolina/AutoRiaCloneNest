import { RoleEnum } from '../../../database/enums/role-enum';
import { AccountTypeEnum } from '../../../database/enums/account-type.enum';

export interface IUserData {
  userId: string;
  email: string;
  role: RoleEnum;
  accountType: AccountTypeEnum;
}
