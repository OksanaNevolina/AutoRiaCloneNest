import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UserService } from '../../user/services/user.service';
import { SignInRequestDto } from '../dto/request/sign-in.request.dto';
import { SignUpRequestDto } from '../dto/request/sign-up.request.dto';
import { AuthUserResponseDto } from '../dto/response/auth-user.response.dto';
import { TokenResponseDto } from '../dto/response/token.response.dto';
import { IUserData } from '../interfaces/user-data.interface';
import { AuthMapper } from './auth.mapper';
import { AuthCacheService } from './auth-cache.service';
import { TokenService } from './token.service';
import { RoleEnum } from '../../../database/enums/role-enum';
import { ForgotPasswordRequestDto } from '../dto/request/forgot-password.request.dto';
import { ActionTokenTypeEnum } from '../enums/action-token-type.enum';
import { ActionTokenRepository } from '../../repository/services/action-token.repository';
import { EmailActionEnum } from '../enums/email-action.enum';
import { EmailService } from './email.service';
import { UserEntity } from '../../../database/entities/user.entity';
import { SetForgotPasswordRequestDto } from '../dto/request/set-forgot-password.request.dto';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly actionTokenRepository: ActionTokenRepository,
    private readonly emailService: EmailService,
  ) {}

  public async signUpSeller(
    dto: SignUpRequestDto,
  ): Promise<AuthUserResponseDto> {
    await this.userService.isEmailUniqueOrThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password, role: RoleEnum.SELLER }),
    );

    const tokens = await this.tokenService.generateAuthTokens(
      {
        userId: user.id,
        role: RoleEnum.SELLER,
      },
      RoleEnum.SELLER,
    );

    await Promise.all([
      this.refreshTokenRepository.saveToken(user.id, tokens.refreshToken),
      this.authCacheService.saveToken(
        user.id,
        tokens.accessToken,
        RoleEnum.SELLER,
      ),
    ]);

    return AuthMapper.toResponseDto(user, tokens);
  }

  public async signUpAdmin(
    dto: SignUpRequestDto,
  ): Promise<AuthUserResponseDto> {
    await this.userService.isEmailUniqueOrThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password, role: RoleEnum.ADMIN }),
    );

    const tokens = await this.tokenService.generateAuthTokens(
      {
        userId: user.id,
        role: RoleEnum.ADMIN,
      },
      RoleEnum.ADMIN,
    );

    await Promise.all([
      this.refreshTokenRepository.saveToken(user.id, tokens.refreshToken),
      this.authCacheService.saveToken(
        user.id,
        tokens.accessToken,
        RoleEnum.ADMIN,
      ),
    ]);

    return AuthMapper.toResponseDto(user, tokens);
  }

  public async signInSeller(
    dto: SignInRequestDto,
  ): Promise<AuthUserResponseDto> {
    const userEntity = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { id: true, password: true },
    });
    if (!userEntity) {
      throw new UnauthorizedException();
    }

    const isPasswordsMatch = await bcrypt.compare(
      dto.password,
      userEntity.password,
    );

    if (!isPasswordsMatch) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({ id: userEntity.id });

    const tokens = await this.tokenService.generateAuthTokens(
      {
        userId: user.id,
        role: RoleEnum.SELLER,
      },
      RoleEnum.SELLER,
    );

    await Promise.all([
      this.refreshTokenRepository.delete({
        user_id: user.id,
      }),
      this.authCacheService.removeToken(user.id),
    ]);

    await Promise.all([
      this.refreshTokenRepository.saveToken(user.id, tokens.refreshToken),
      this.authCacheService.saveToken(
        user.id,
        tokens.accessToken,
        RoleEnum.SELLER,
      ),
    ]);

    return AuthMapper.toResponseDto(user, tokens);
  }

  public async signInManager(
    dto: SignInRequestDto,
  ): Promise<AuthUserResponseDto> {
    const userEntity = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { id: true, password: true },
    });
    if (!userEntity) {
      throw new UnauthorizedException();
    }

    const isPasswordsMatch = await bcrypt.compare(
      dto.password,
      userEntity.password,
    );

    if (!isPasswordsMatch) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({ id: userEntity.id });

    const tokens = await this.tokenService.generateAuthTokens(
      {
        userId: user.id,
        role: RoleEnum.MANAGER,
      },
      RoleEnum.MANAGER,
    );

    await Promise.all([
      this.refreshTokenRepository.delete({
        user_id: user.id,
      }),
      this.authCacheService.removeToken(user.id),
    ]);

    await Promise.all([
      this.refreshTokenRepository.saveToken(user.id, tokens.refreshToken),
      this.authCacheService.saveToken(
        user.id,
        tokens.accessToken,
        RoleEnum.MANAGER,
      ),
    ]);

    return AuthMapper.toResponseDto(user, tokens);
  }

  public async signInAdmin(
    dto: SignInRequestDto,
  ): Promise<AuthUserResponseDto> {
    const userEntity = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { id: true, password: true },
    });
    if (!userEntity) {
      throw new UnauthorizedException();
    }

    const isPasswordsMatch = await bcrypt.compare(
      dto.password,
      userEntity.password,
    );

    if (!isPasswordsMatch) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({ id: userEntity.id });

    const tokens = await this.tokenService.generateAuthTokens(
      {
        userId: user.id,
        role: RoleEnum.ADMIN,
      },
      RoleEnum.ADMIN,
    );

    await Promise.all([
      this.refreshTokenRepository.delete({
        user_id: user.id,
      }),
      this.authCacheService.removeToken(user.id),
    ]);

    await Promise.all([
      this.refreshTokenRepository.saveToken(user.id, tokens.refreshToken),
      this.authCacheService.saveToken(
        user.id,
        tokens.accessToken,
        RoleEnum.ADMIN,
      ),
    ]);

    return AuthMapper.toResponseDto(user, tokens);
  }

  public async logout(userData: IUserData): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        user_id: userData.userId,
      }),
      this.authCacheService.removeToken(userData.userId),
    ]);
  }

  public async updateRefreshTokenSeller(
    userData: IUserData,
  ): Promise<TokenResponseDto> {
    const user = await this.userRepository.findOneBy({
      id: userData.userId,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        user_id: user.id,
      }),
      this.authCacheService.removeToken(user.id),
    ]);
    const tokens = await this.tokenService.generateAuthTokens(
      {
        userId: user.id,
        role: RoleEnum.SELLER,
      },
      RoleEnum.SELLER,
    );

    await Promise.all([
      this.refreshTokenRepository.saveToken(user.id, tokens.refreshToken),
      this.authCacheService.saveToken(
        user.id,
        tokens.accessToken,
        RoleEnum.SELLER,
      ),
    ]);
    return tokens;
  }

  public async updateRefreshTokenAdmin(
    userData: IUserData,
  ): Promise<TokenResponseDto> {
    const user = await this.userRepository.findOneBy({
      id: userData.userId,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        user_id: user.id,
      }),
      this.authCacheService.removeToken(user.id),
    ]);
    const tokens = await this.tokenService.generateAuthTokens(
      {
        userId: user.id,
        role: RoleEnum.ADMIN,
      },
      RoleEnum.ADMIN,
    );

    await Promise.all([
      this.refreshTokenRepository.saveToken(user.id, tokens.refreshToken),
      this.authCacheService.saveToken(
        user.id,
        tokens.accessToken,
        RoleEnum.ADMIN,
      ),
    ]);
    return tokens;
  }

  public async updateRefreshTokenManager(
    userData: IUserData,
  ): Promise<TokenResponseDto> {
    const user = await this.userRepository.findOneBy({
      id: userData.userId,
    });

    await Promise.all([
      this.refreshTokenRepository.delete({
        user_id: user.id,
      }),
      this.authCacheService.removeToken(user.id),
    ]);
    const tokens = await this.tokenService.generateAuthTokens(
      {
        userId: user.id,
        role: RoleEnum.MANAGER,
      },
      RoleEnum.MANAGER,
    );

    await Promise.all([
      this.refreshTokenRepository.saveToken(user.id, tokens.refreshToken),
      this.authCacheService.saveToken(
        user.id,
        tokens.accessToken,
        RoleEnum.MANAGER,
      ),
    ]);
    return tokens;
  }

  public async forgotPassword(dto: ForgotPasswordRequestDto) {
    const user: UserEntity = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const actionToken = await this.tokenService.createActionToken(
      { userId: user.id, role: RoleEnum.SELLER },
      ActionTokenTypeEnum.FORGOT,
    );

    await this.actionTokenRepository.saveActionToken(user.id, actionToken);
    await this.emailService.sendMail(
      user.email,
      EmailActionEnum.FORGOT_PASSWORD,
      {
        actionToken,
      },
    );
  }

  public async setForgotPassword(
    dto: SetForgotPasswordRequestDto,
    actionToken: string,
  ) {
    const payload = await this.tokenService.checkActionToken(
      actionToken,
      ActionTokenTypeEnum.FORGOT,
    );
    const entity = await this.actionTokenRepository.findOneBy({
      actionToken,
    });
    if (!entity) {
      throw new BadRequestException();
    }
    const newHashedPassword = await bcrypt.hash(dto.password, 10);

    await this.userRepository.update(payload.userId, {
      password: newHashedPassword,
    });

    await this.actionTokenRepository.delete({ actionToken });
  }
}
