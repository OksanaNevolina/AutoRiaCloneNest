import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
import { ChangePasswordRequestDto } from '../dto/request/change-password.request.dto';
import { DealerRepository } from '../../repository/services/dealer.repository';
import { DataSource, EntityManager } from 'typeorm';
import { DealerEntity } from '../../../database/entities/dealer.entity';
import { RefreshTokenEntity } from '../../../database/entities/refresh-token.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ActionTokenEntity } from '../../../database/entities/action-token.entity';

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
    private readonly dealerRepository: DealerRepository,
    private readonly dataSource: DataSource,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async signUpSeller(
    dto: SignUpRequestDto,
  ): Promise<AuthUserResponseDto> {
    const user = await this.dataSource.transaction(
      async (em: EntityManager) => {
        await this.userService.isEmailUniqueOrThrow(dto.email, em);
        const userRepository = em.getRepository(UserEntity);

        const password = await bcrypt.hash(dto.password, 10);
        const user = userRepository.create({
          ...dto,
          password,
          role: RoleEnum.SELLER,
        });

        const dealerRepository = em.getRepository(DealerEntity);
        if (dto.dealerId) {
          user.dealer = await dealerRepository.findOneBy({ id: dto.dealerId });
        }

        return await userRepository.save(user);
      },
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
    const user = await this.dataSource.transaction(
      async (em: EntityManager) => {
        await this.userService.isEmailUniqueOrThrow(dto.email, em);
        const userRepository = em.getRepository(UserEntity);

        const password = await bcrypt.hash(dto.password, 10);
        const user = userRepository.create({
          ...dto,
          password,
          role: RoleEnum.ADMIN,
        });

        const dealerRepository = em.getRepository(DealerEntity);
        if (dto.dealerId) {
          user.dealer = await dealerRepository.findOneBy({ id: dto.dealerId });
        }

        return await userRepository.save(user);
      },
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
    return await this.dataSource.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);

      const userEntity = await userRepository.findOne({
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

      const user = await userRepository.findOneBy({ id: userEntity.id });

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
        this.refreshTokenRepository.saveToken(user.id, tokens.refreshToken, em),
        this.authCacheService.saveToken(
          user.id,
          tokens.accessToken,
          RoleEnum.SELLER,
        ),
      ]);

      return AuthMapper.toResponseDto(user, tokens);
    });
  }

  public async signInManager(
    dto: SignInRequestDto,
  ): Promise<AuthUserResponseDto> {
    return await this.dataSource.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      const refreshTokenRepository = em.getRepository(RefreshTokenEntity);

      const userEntity = await userRepository.findOne({
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

      const user = await userRepository.findOneBy({ id: userEntity.id });

      const tokens = await this.tokenService.generateAuthTokens(
        {
          userId: user.id,
          role: RoleEnum.MANAGER,
        },
        RoleEnum.MANAGER,
      );

      await Promise.all([
        refreshTokenRepository.delete({
          user_id: user.id,
        }),
        this.authCacheService.removeToken(user.id),
      ]);

      await Promise.all([
        this.refreshTokenRepository.saveToken(user.id, tokens.refreshToken, em),
        this.authCacheService.saveToken(
          user.id,
          tokens.accessToken,
          RoleEnum.MANAGER,
        ),
      ]);

      return AuthMapper.toResponseDto(user, tokens);
    });
  }

  public async signInAdmin(
    dto: SignInRequestDto,
  ): Promise<AuthUserResponseDto> {
    return await this.dataSource.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      const refreshTokenRepository = new RefreshTokenRepository(
        this.dataSource,
      );

      const userEntity = await userRepository.findOne({
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

      const user = await userRepository.findOneBy({ id: userEntity.id });

      const tokens = await this.tokenService.generateAuthTokens(
        {
          userId: user.id,
          role: RoleEnum.ADMIN,
        },
        RoleEnum.ADMIN,
      );

      await Promise.all([
        refreshTokenRepository.delete({
          user_id: user.id,
        }),
        this.authCacheService.removeToken(user.id),
      ]);

      await refreshTokenRepository.saveToken(user.id, tokens.refreshToken, em);
      await this.authCacheService.saveToken(
        user.id,
        tokens.accessToken,
        RoleEnum.ADMIN,
      );

      return AuthMapper.toResponseDto(user, tokens);
    });
  }

  public async logout(userData: IUserData): Promise<void> {
    await this.entityManager.transaction(async (em: EntityManager) => {
      const refreshTokenRepository = em.getRepository(RefreshTokenEntity);

      await Promise.all([
        refreshTokenRepository.delete({
          user_id: userData.userId,
        }),
        this.authCacheService.removeToken(userData.userId),
      ]);
    });
  }

  public async updateRefreshTokenSeller(
    userData: IUserData,
  ): Promise<TokenResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      const refreshTokenRepository = this.entityManager.getRepository(
        RefreshTokenEntity,
      ) as RefreshTokenRepository;

      const user = await userRepository.findOneBy({
        id: userData.userId,
      });

      await Promise.all([
        refreshTokenRepository.delete({
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
        refreshTokenRepository.saveToken(user.id, tokens.refreshToken),
        this.authCacheService.saveToken(
          user.id,
          tokens.accessToken,
          RoleEnum.SELLER,
        ),
      ]);

      return tokens;
    });
  }
  public async updateRefreshTokenAdmin(
    userData: IUserData,
  ): Promise<TokenResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      const refreshTokenRepository = this.entityManager.getRepository(
        RefreshTokenEntity,
      ) as RefreshTokenRepository;

      const user = await userRepository.findOneBy({
        id: userData.userId,
      });

      await Promise.all([
        refreshTokenRepository.delete({
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
        refreshTokenRepository.saveToken(user.id, tokens.refreshToken),
        this.authCacheService.saveToken(
          user.id,
          tokens.accessToken,
          RoleEnum.ADMIN,
        ),
      ]);

      return tokens;
    });
  }

  public async updateRefreshTokenManager(
    userData: IUserData,
  ): Promise<TokenResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      const refreshTokenRepository = this.entityManager.getRepository(
        RefreshTokenEntity,
      ) as RefreshTokenRepository;

      const user = await userRepository.findOneBy({
        id: userData.userId,
      });

      await Promise.all([
        refreshTokenRepository.delete({
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
        refreshTokenRepository.saveToken(user.id, tokens.refreshToken),
        this.authCacheService.saveToken(
          user.id,
          tokens.accessToken,
          RoleEnum.MANAGER,
        ),
      ]);

      return tokens;
    });
  }

  public async forgotPassword(dto: ForgotPasswordRequestDto): Promise<string> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      const actionTokenRepository = em.getRepository(
        ActionTokenEntity,
      ) as ActionTokenRepository;
      const user: UserEntity = await userRepository.findOneBy({
        email: dto.email,
      });
      if (!user) {
        throw new UnauthorizedException();
      }
      const actionToken = await this.tokenService.createActionToken(
        { userId: user.id, role: RoleEnum.SELLER },
        ActionTokenTypeEnum.FORGOT,
      );

      await actionTokenRepository.saveActionToken(user.id, actionToken);
      await this.emailService.sendMail(
        user.email,
        EmailActionEnum.FORGOT_PASSWORD,
        {
          actionToken,
        },
      );
      return 'successful forgotPassword';
    });
  }

  public async setForgotPassword(
    dto: SetForgotPasswordRequestDto,
    actionToken: string,
  ) {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const actionTokenRepository = em.getRepository(ActionTokenEntity);
      const userRepository = em.getRepository(UserEntity);
      const payload = await this.tokenService.checkActionToken(
        actionToken,
        ActionTokenTypeEnum.FORGOT,
      );
      const entity = await actionTokenRepository.findOneBy({
        actionToken,
      });
      if (!entity) {
        throw new BadRequestException();
      }
      const newHashedPassword = await bcrypt.hash(dto.password, 10);

      await userRepository.update(payload.userId, {
        password: newHashedPassword,
      });

      await actionTokenRepository.delete({ actionToken });
      return 'successful setForgotPassword ';
    });
  }
  public async changePassword(
    dto: ChangePasswordRequestDto,
    userData: IUserData,
  ): Promise<string> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity)
      const user = await userRepository.findOne({
        where: {
          id: userData.userId,
        },
        select: ['id', 'password'],
      });
      if (!user) {
        throw new NotFoundException();
      }
      const isPasswordsMatch = await bcrypt.compare(
        dto.oldPassword,
        user.password,
      );

      if (!isPasswordsMatch) {
        throw new BadRequestException('Incorrect password');
      }
      const newPassword = await bcrypt.hash(dto.newPassword, 10);

      await userRepository.update(user.id, {
        password: newPassword,
      });
      return 'successful changePassword';
    });
  }
}
