import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Config, JWTConfig } from '../../../configs/config.type';
import { RoleEnum } from '../../../database/enums/role-enum';
import { RedisService } from '../../redis/redis.service';
import { AUTH_CACHE } from '../constants/constants';

@Injectable()
export class AuthCacheService {
  private jwtConfig: JWTConfig;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = this.configService.get<JWTConfig>('jwt');
  }

  public async saveToken(
    userId: string,
    accessToken: string,
    role: RoleEnum,
  ): Promise<void> {
    let accessExpiresIn: number;

    switch (role) {
      case RoleEnum.SELLER:
        accessExpiresIn = this.jwtConfig.sellerAccessTokenExpiration;
        break;
      case RoleEnum.MANAGER:
        accessExpiresIn = this.jwtConfig.managerAccessTokenExpiration;
        break;
      case RoleEnum.ADMIN:
        accessExpiresIn = this.jwtConfig.adminAccessTokenExpiration;
        break;
    }
    const key = `${AUTH_CACHE.ACCESS_TOKEN}:${userId}`;

    await this.redisService.deleteByKey(key);
    await this.redisService.addOneToSet(key, accessToken);
    await this.redisService.expire(key, accessExpiresIn);
  }

  public async removeToken(userId: string): Promise<void> {
    await this.redisService.deleteByKey(`${AUTH_CACHE.ACCESS_TOKEN}:${userId}`);
  }

  public async isAccessTokenExist(
    userId: string,
    accessToken: string,
  ): Promise<boolean> {
    const userAccessTokens = await this.redisService.sMembers(
      `${AUTH_CACHE.ACCESS_TOKEN}:${userId}`,
    );
    return userAccessTokens.some((token: string) => token === accessToken);
  }
}
