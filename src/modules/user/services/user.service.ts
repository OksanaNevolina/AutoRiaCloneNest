import {
  ConflictException,
  Injectable, Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IUserData } from '../../auth/interfaces/user-data.interface';

import { UserMapper } from './user.mapper';
import { UserRepository } from '../../repository/services/user.repository';
import { UserResponseDto } from '../dto/response/user.response.dto';
import { UpdateUserRequestDto } from '../dto/request/update-user.request.dto';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserEntity } from '../../../database/entities/user.entity';

import * as bcrypt from 'bcrypt';
import { RoleEnum } from '../../../database/enums/role-enum';

import {CreateManagerRequestDto} from "../dto/request/create-manager.request.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async createManager(
    userData: IUserData,
    dto: CreateManagerRequestDto,
  ): Promise<UserResponseDto>{
    const admin = await this.userRepository.findOneBy({ id: userData.userId });
    if (!admin || admin.role !== RoleEnum.ADMIN) {
      throw new Error("Only administrators can create managers");
    }
    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password }),
    );
    return UserMapper.toResponseDto(user);
  }

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
      await this.refreshTokenRepository.delete({ user: user });
      await this.userRepository.delete({ id: userData.userId });
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
