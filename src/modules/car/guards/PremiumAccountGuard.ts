import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserEntity } from '../../../database/entities/user.entity';
import { AccountTypeEnum } from '../../../database/enums/account-type.enum';

@Injectable()
export class PremiumAccountGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    return user.accountType === AccountTypeEnum.PREMIUM;
  }
}
