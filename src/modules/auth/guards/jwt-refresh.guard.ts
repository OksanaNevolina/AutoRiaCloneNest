import {
  CanActivate,
  ExecutionContext,
  Injectable, Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { TokenType } from '../enums/token-type.enum';
import { TokenService } from '../services/token.service';
import { RoleEnum } from '../../../database/enums/role-enum';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private refreshRepository: RefreshTokenRepository,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.get('Authorization')?.split('Bearer ')[1];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const role = request.headers.role as RoleEnum;
    Logger.log(role,refreshToken)
    const payload = await this.tokenService.checkToken(
      refreshToken,
      TokenType.REFRESH,
      role,
    );
    Logger.log(payload)
    if (!payload) {
      throw new UnauthorizedException();
    }

    const isExist = await this.refreshRepository.isTokenExist(refreshToken);
    if (!isExist) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    // request.user = { user };
    request.user = {
      userId: user.id,
      email: user.email,
    };
    return true;
  }
}
