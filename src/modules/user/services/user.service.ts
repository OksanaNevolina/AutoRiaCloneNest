import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { RefreshTokenEntity } from '../../../database/entities/refresh-token.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateUserRequestDto } from '../dto/request/update-user.request.dto';
import { UserResponseDto } from '../dto/response/user.response.dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async findMe(userData: IUserData): Promise<UserResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      try {
        const entity = await userRepository.findOneBy({
          id: userData.userId,
        });
        return UserMapper.toResponseDto(entity);
      } catch (error) {
        throw new UnprocessableEntityException('User not found');
      }
    });
  }

  public async updateMe(
    userData: IUserData,
    dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      try {
        const entity = await this.findByIdOrThrow(userData.userId, em);
        const user = await userRepository.save({ ...entity, ...dto });
        return UserMapper.toResponseDto(user);
      } catch (error) {
        throw new UnprocessableEntityException('Failed to update user data');
      }
    });
  }

  public async deleteMe(userData: IUserData): Promise<void> {
    await this.entityManager.transaction(async (em: EntityManager) => {
      const refreshTokenRepository = em.getRepository(RefreshTokenEntity);
      const userRepository = em.getRepository(UserEntity);
      try {
        const user = await this.findByIdOrThrow(userData.userId, em);
        if (!user) {
          throw new NotFoundException('User not found');
        }

        const refreshTokens = await refreshTokenRepository.find({
          where: { user: { id: userData.userId } },
        });

        await refreshTokenRepository.delete({ user: user });
        await Promise.all(
          refreshTokens.map(async (token) => {
            await refreshTokenRepository.remove(token);
          }),
        );

        await userRepository.remove(user);
      } catch (error) {
        throw new UnprocessableEntityException('Failed to delete user data');
      }
    });
  }

  public async findByIdOrThrow(
    userId: string,
    em?: EntityManager,
  ): Promise<UserEntity> {
    const userRepository = em.getRepository(UserEntity) ?? this.userRepository;
    const entity = await userRepository.findOneBy({ id: userId });
    if (!entity) {
      throw new UnprocessableEntityException();
    }
    return entity;
  }

  public async isEmailUniqueOrThrow(
    email: string,
    em?: EntityManager,
  ): Promise<void> {
    const userRepository = em.getRepository(UserEntity) ?? this.userRepository;
    const user = await userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email is already in use');
    }
  }
}
