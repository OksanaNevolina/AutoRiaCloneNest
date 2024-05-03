import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Config, JWTConfig } from '../../../configs/config.type';
import { TokenResponseDto } from '../dto/response/token.response.dto';
import { TokenType } from '../enums/token-type.enum';
import { JwtPayload } from '../types/jwt-payload.type';
import { RoleEnum } from '../../../database/enums/role-enum';
import {ActionTokenTypeEnum} from "../enums/action-token-type.enum";

@Injectable()
export class TokenService {
  private jwtConfig: JWTConfig;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<Config>,
  ) {
    this.jwtConfig = this.configService.get<JWTConfig>('jwt');
  }

  public async generateAuthTokens(
    payload: JwtPayload,
    role: RoleEnum,
  ): Promise<TokenResponseDto> {
    let accessTokenSecret: string;
    let accessExpiresIn: number;
    let refreshTokenSecret: string;
    let refreshExpiresIn: number;

    switch (role) {
      case RoleEnum.SELLER:
        accessTokenSecret = this.jwtConfig.sellerAccessTokenSecret;
        accessExpiresIn = this.jwtConfig.sellerAccessTokenExpiration;
        refreshTokenSecret = this.jwtConfig.sellerRefreshTokenSecret;
        refreshExpiresIn = this.jwtConfig.sellerRefreshTokenExpiration;
        break;
      case RoleEnum.MANAGER:
        accessTokenSecret = this.jwtConfig.managerAccessTokenSecret;
        accessExpiresIn = this.jwtConfig.managerAccessTokenExpiration;
        refreshTokenSecret = this.jwtConfig.managerRefreshTokenSecret;
        refreshExpiresIn = this.jwtConfig.managerRefreshTokenExpiration;
        break;
      case RoleEnum.ADMIN:
        accessTokenSecret = this.jwtConfig.adminAccessTokenSecret;
        accessExpiresIn = this.jwtConfig.adminAccessTokenExpiration;
        refreshTokenSecret = this.jwtConfig.adminRefreshTokenSecret;
        refreshExpiresIn = this.jwtConfig.adminRefreshTokenExpiration;
        break;
    }
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: accessTokenSecret,
      expiresIn: accessExpiresIn,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshTokenSecret,
      expiresIn: refreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
  public async checkToken(
    token: string,
    type: TokenType,
    role: RoleEnum,
  ): Promise<JwtPayload> {
    switch (role) {
      case RoleEnum.ADMIN:
        return await this.checkTokenAdmin(token, type);
      case RoleEnum.MANAGER:
        return await this.checkTokenManager(token, type);
      case RoleEnum.SELLER:
        return await this.checkTokenSeller(token, type);
    }
  }

  private async checkTokenAdmin(
    token: string,
    type: TokenType,
  ): Promise<JwtPayload> {
    try {
      let secret: string;

      switch (type) {
        case TokenType.ACCESS:
          secret = this.jwtConfig.adminAccessTokenSecret;
          break;
        case TokenType.REFRESH:
          secret = this.jwtConfig.adminRefreshTokenSecret;
          break;
      }
      return await this.jwtService.verifyAsync(token, { secret });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async checkTokenManager(
    token: string,
    type: TokenType,
  ): Promise<any> {
    try {
      let secret: string;

      switch (type) {
        case TokenType.ACCESS:
          secret = this.jwtConfig.managerAccessTokenSecret;
          break;
        case TokenType.REFRESH:
          secret = this.jwtConfig.managerRefreshTokenSecret;
          break;
      }
      Logger.log(secret,type)
      return await this.jwtService.verifyAsync(token, { secret });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async checkTokenSeller(
    token: string,
    type: TokenType,
  ): Promise<any> {
    try {
      let secret: string;

      switch (type) {
        case TokenType.ACCESS:
          secret = this.jwtConfig.sellerAccessTokenSecret;
          break;
        case TokenType.REFRESH:
          secret = this.jwtConfig.sellerRefreshTokenSecret;
          break;
      }
      return await this.jwtService.verifyAsync(token, { secret }) as JwtPayload;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
  public async  createActionToken(
      payload: JwtPayload,
      tokenType: ActionTokenTypeEnum,
  ):Promise<string> {
    let secret: string;

    switch (tokenType) {
      case ActionTokenTypeEnum.FORGOT:
        secret = this.jwtConfig.forgotSecret;
        break;
      default:
        throw new UnauthorizedException();
    }
    return await this.jwtService.signAsync(payload, {
     secret: secret,
     expiresIn: this.jwtConfig.forgotExpiration,
   });
  }
  public async checkActionToken(actionToken: string, type: ActionTokenTypeEnum) :Promise<JwtPayload>{
    try {
      let secret: string;

      switch (type) {
        case ActionTokenTypeEnum.FORGOT:
          secret = this.jwtConfig.forgotSecret;
          break;
      }

      return await this.jwtService.verifyAsync(actionToken, { secret });

    } catch (e) {
      throw new UnauthorizedException();
    }
  }

}
