import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IUserData } from '../../auth/interfaces/user-data.interface';

import { UserMapper } from './user.mapper';
import { UserRepository } from '../../repository/services/user.repository';
import { UserResponseDto } from '../dto/response/user.response.dto';
import { UpdateUserRequestDto } from '../dto/request/update-user.request.dto';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserEntity } from '../../../database/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async findMe(userData: IUserData): Promise<UserResponseDto> {
    try {
      const entity = await this.userRepository.findOneBy({
        id: userData.userId,
      });
      return UserMapper.toResponseDto(entity);
    } catch (error) {
      throw new UnprocessableEntityException('User not found');
    }
  }

  public async updateMe(
    userData: IUserData,
    dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    try {
      const entity = await this.findByIdOrThrow(userData.userId);
      const user = await this.userRepository.save({ ...entity, ...dto });
      return UserMapper.toResponseDto(user);
    } catch (error) {
      throw new UnprocessableEntityException('Failed to update user data');
    }
  }

  public async deleteMe(userData: IUserData): Promise<void> {
    try {
      const user = await this.findByIdOrThrow(userData.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const refreshTokens = await this.refreshTokenRepository.find({
        where: { user: { id: userData.userId } },
      });

      await this.refreshTokenRepository.delete({ user: user });
      await Promise.all(
        refreshTokens.map(async (token) => {
          await this.refreshTokenRepository.remove(token);
        }),
      );

      await this.userRepository.remove(user);
    } catch (error) {
      throw new UnprocessableEntityException('Failed to delete user data');
    }
  }

  public async findByIdOrThrow(userId: string): Promise<UserEntity> {
    const entity = await this.userRepository.findOneBy({ id: userId });
    if (!entity) {
      throw new UnprocessableEntityException();
    }
    return entity;
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email is already in use');
    }
  }
}
