import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserEntity } from '../../../database/entities/user.entity';
import { RoleEnum } from '../../../database/enums/role-enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    return user.role === RoleEnum.ADMIN;
  }
}
